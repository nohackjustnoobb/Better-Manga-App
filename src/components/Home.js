import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";
import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiRefresh, mdiCloudSync, mdiChevronDown, mdiDatabase } from "@mdi/js";

import "./Home.css";

import Collections from "./collections";
import History from "./history";
import Library from "./library";
import Settings from "./settings";

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const tabs = {
  收藏庫: <Collections />,
  歴史: <History />,
  書庫: <Library />,
  設定: <Settings />,
};

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const slideRenderer = ({ key, index }) => {
  return (
    <div key={key} className={"tab"}>
      {Object.values(tabs)[index]}
    </div>
  );
};

const TabButtons = ({ index }) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    var interval = setInterval(() => forceUpdate(), 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabButtons = [
    <div id="update">
      <div onClick={() => window.betterMangaApp.updateCollections()}>
        <Icon path={mdiRefresh} size={0.75} />
        <p>更新</p>
      </div>
      <p>
        {window.betterMangaApp.isUpdating
          ? `更新中 ${window.betterMangaApp.updateState}`
          : `更新於 ${Math.round(
              (Date.now() - window.betterMangaApp.updateTime) / 60000
            )} 分鐘前`}
      </p>
    </div>,
    <div id="update">
      <div>
        <Icon path={mdiCloudSync} size={0.75} />
        <p>同步</p>
      </div>
      <p>{}</p>
    </div>,
    <div id="drivers">
      <Icon
        path={mdiDatabase}
        size={0.75}
        style={{ transform: ["translateX(2rem)"] }}
      />
      <select
        defaultValue={window.betterMangaApp.selectedDriver}
        onChange={(event) => {
          window.betterMangaApp.selectedDriver = event.target.value;
          window.init[2](true);
        }}
      >
        {window.betterMangaApp.availableDrivers?.map((v) => (
          <option>{v}</option>
        ))}
      </select>
      <Icon path={mdiChevronDown} size={0.75} />
    </div>,
  ];

  return tabButtons[index];
};

const Home = () => {
  const [index, setIndex] = useState(0);
  const styles = {
    selected: {
      fontSize: "2rem",
      transform: ["translateY(.25rem)"],
    },
    notSelected: {
      fontSize: "1rem",
      color: "#BEBEBE",
      cursor: "pointer",
    },
  };

  const forceUpdate = useForceUpdate();
  window.forceUpdate = () => forceUpdate();
  useEffect(() => {
    window.betterMangaApp.init();
    window.init = {};
  }, []);

  const setPage = (page) => {
    setIndex(page);
    if (window.init[page]) {
      window.init[page]();
    }
  };

  return (
    <>
      <ul id="tabMenu">
        <div>
          {Object.keys(tabs).map((v, i) => (
            <li
              key={i}
              onClick={i === index ? () => {} : () => setPage(i)}
              style={styles[i === index ? "selected" : "notSelected"]}
            >
              {v}
            </li>
          ))}
        </div>
        <TabButtons index={index} />
      </ul>
      <VirtualizeSwipeableViews
        slideRenderer={slideRenderer}
        slideCount={Object.keys(tabs).length}
        index={index}
        onChangeIndex={(index) => setPage(index)}
        enableMouseEvents
      />
    </>
  );
};

export default Home;
