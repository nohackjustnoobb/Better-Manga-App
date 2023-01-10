import React from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { InfinitySpin } from "react-loader-spinner";

import { convertRemToPixels } from "../../util";
import "./library.css";

const categories = {
  Passionate: "熱血",
  Love: "戀愛",
  Campus: "校園",
  Yuri: "百合",
  BL: "甲甲",
  Adventure: "冒險",
  Harem: "后宮",
  "Sci-Fi": "科幻",
  War: "戰爭",
  Suspense: "懸疑",
  Speculation: "推理",
  Funny: "搞笑",
  Fantasy: "奇幻",
  Magic: "魔法",
  Horror: "恐怖",
  Ghosts: "神鬼",
  History: "歷史",
  "Fan-Fi": "同人",
  Sports: "運動",
  Hentai: "Hentai",
  Mecha: "機甲",
  Restricted: "R18",
  "Cross-Dressing": "偽娘",
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = { suggestion: [], focus: false };
  }

  searchChange(e) {
    this.search = e.target.value;
    setTimeout(() => {
      if (this.search && this.search === e.target.value) {
        // TODO
      }
    }, 1000);
  }

  render() {
    return (
      <div id="search">
        <input
          type="text"
          onChange={(e) => this.searchChange(e)}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
        />
        <Icon path={mdiMagnify} size={1} color={"#999999"} className="icon" />
        {this.state.focus ? (
          <ul>
            {this.state.suggestion.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      init: false,
      selected: undefined,
      listLoading: true,
      pageLoading: false,
      page: 1,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => this.forceUpdate());
    window.addEventListener("orientationchange", () => this.forceUpdate());

    window.init[2] = (force = false) => {
      if (this.state.init && !force) return;
      this.setState(
        {
          init: true,
          loading: true,
          listLoading: true,
          pageLoading: false,
          page: 1,
        },
        () => {
          (async () => {
            await window.betterMangaApp.selectedDriver.getCategories();
            this.setState({ loading: false });
          })();

          (async () => {
            await window.betterMangaApp.selectedDriver.getList(
              this.state.selected,
              1
            );
            this.setState({ listLoading: false });
          })();
        }
      );
    };
  }

  async select(v) {
    this.setState(
      {
        listLoading: true,
        pageLoading: false,
        page: 1,
        selected: v,
      },
      async () => {
        await window.betterMangaApp.selectedDriver.getList(v, this.state.page);

        this.setState({ listLoading: false });
      }
    );
  }

  async onScroll(e) {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
      ) < 50;

    if (bottom && !this.pageLoading) {
      this.pageLoading = true;
      this.setState(
        {
          pageLoading: true,
          page: this.state.page + 1,
        },
        async () => {
          await window.betterMangaApp.selectedDriver.getList(
            this.state.selected,
            this.state.page
          );
          this.setState(
            { pageLoading: false },
            () => (this.pageLoading = false)
          );
        }
      );
    }
  }

  render() {
    const getWidth = () => {
      const width =
        window.innerWidth -
        convertRemToPixels(3) -
        convertRemToPixels(isPhone ? 5 : 10);

      const columnCount = Math.round(width / targetWidth);
      return [
        (width - convertRemToPixels(1) * (columnCount - 1)) / columnCount,
        columnCount,
        width,
      ];
    };

    const getList = () => {
      var result = [];
      for (var i = 1; i <= this.state.page; i++) {
        const list =
          window.betterMangaApp.selectedDriver.list[
            `${this.state.selected}${i}`
          ];

        if (list) {
          result.push(
            ...list.map((v) =>
              window.betterMangaApp.selectedDriver.getCachedManga(v, false)
            )
          );
        }
      }
      return result;
    };

    const isPhone = window.innerWidth < window.innerHeight;
    const targetWidth = 150;
    const [width, columnCount, listWidth] = getWidth();

    return (
      <div id="library">
        {this.state.loading ? (
          <div className="center">
            <InfinitySpin width="200" color="#000" />
          </div>
        ) : (
          <>
            {isPhone ? (
              <div className="searchContainer">{<Search />}</div>
            ) : (
              <></>
            )}
            <div
              id="content"
              style={{ height: `calc(100% - ${isPhone ? 3.25 : 0}rem)` }}
            >
              <ul id="categories" style={{ width: `${isPhone ? 5 : 10}rem` }}>
                {isPhone ? <></> : <Search />}
                <li
                  onClick={() => this.select(undefined)}
                  className={this.state.selected ? "" : "selected"}
                >
                  全部
                </li>
                {window.betterMangaApp.selectedDriver.categories.map((v) => (
                  <li
                    key={v}
                    onClick={() => this.select(v)}
                    className={this.state.selected === v ? "selected" : ""}
                  >
                    {categories[v]}
                  </li>
                ))}
              </ul>
              {this.state.listLoading ? (
                <div
                  className="center"
                  style={{ width: `calc(100vw - ${isPhone ? 7 : 12}rem)` }}
                >
                  <InfinitySpin width="150" color="#000" />
                </div>
              ) : (
                <div id="list" onScroll={(e) => this.onScroll(e)}>
                  <ul
                    style={{
                      gridTemplateColumns: Array(columnCount)
                        .fill(`${width}px`)
                        .join(" "),
                      width: listWidth,
                    }}
                  >
                    {getList().map((v) => (
                      <li
                        key={`${v.driver.identifier}${v.id}`}
                        style={{ width: width }}
                        onClick={() => window.showDetails(v)}
                      >
                        {v.isEnd ? <div className="end">完結</div> : <></>}
                        <img
                          src={v.thumbnail}
                          alt={v.thumbnail}
                          width={width}
                        />
                        <p>{window.betterMangaApp.translate(v.title)}</p>
                        <p className="latest">
                          更新至 {window.betterMangaApp.translate(v.latest)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {this.state.pageLoading ? (
                    <div className="pageLoader">
                      <InfinitySpin width="150" color="#000" />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Library;
export { categories };
