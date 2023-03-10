import { InfinitySpin } from "react-loader-spinner";
import { useState, useEffect } from "react";

import "./util.css";

function Loader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.showLoader = () => setShow(true);
    window.hideLoader = () => setShow(false);
  }, []);

  return show ? (
    <div className="loader">
      <div className="container">
        <InfinitySpin width="200" color="#000" />
        加載中
      </div>
    </div>
  ) : (
    <></>
  );
}

const convertRemToPixels = (rem) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const forceUpdateAll = () => window.forceUpdate.forEach((f) => f());

export { Loader, convertRemToPixels, useForceUpdate, forceUpdateAll };
