import * as React from "react";
import { isEqual } from "lodash";

export const HelloComponent = () => {
  return <Parent />;
};

export const Parent = () => {
  const [count, setCount] = React.useState(0);
  const [firstName, setFirstName] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <input
        placeholder="firstName"
        onChange={(e) => setFirstName(e.target.value)}
      />

      <Child data={{ firstName }} count={count}></Child>
    </>
  );
};

export const Child = ({ data, count }) => {
  useDepthEffect(() => {
    console.log("data-changed");
  }, [data]);
  return (
    <div>
      <div>
        {data.firstName}
        {data.lastName}
      </div>

      <div>{"count--" + count}</div>
    </div>
  );
};

export const useDepthEffect = (effectFunc, deps) => {
  const prevDeps = React.useRef(deps);
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    );

    if (isFirst.current || !isSame) {
      effectFunc();
    }

    isFirst.current = false;
    prevDeps.current = deps;
  }, [deps]);
};
