import * as React from "react";

export const HelloComponent1 = () => {
  return <Level12></Level12>;
};

export const Level12 = () => {
  const { count, start, stop, reset } = useCounter(0, 500);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <button onClick={reset}>reset</button>
    </div>
  );
};

const useCounter = (initialValue, ms) => {
  let interval = React.useRef(null);
  const [count, setCount] = React.useState(0);

  const start = React.useCallback(() => {
    if (interval.current !== null) return;
    interval.current = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, ms);
  }, []);

  const stop = React.useCallback(() => {
    if (interval.current === null) return;
    clearInterval(interval.current);
    interval.current = null;
  }, []);

  const reset = React.useCallback(() => {
    setCount(0);
  }, []);

  return { count, start, stop, reset };
};

//good optimized code - bit complex though
//how is it optimized - usecallback will help in providing reference to the same function after each rerender.
export const Level11 = () => {
  console.log("renderLevel11");
  let interval = React.useRef(null);
  const [count, setCount] = React.useState(0);

  const start = React.useCallback(() => {
    if (interval.current !== null) return;
    interval.current = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, 500);
  }, []);

  const stop = React.useCallback(() => {
    if (interval.current === null) return;
    clearInterval(interval.current);
    interval.current = null;
  }, []);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

//good code - but performace has to be optimized
export const Level10 = () => {
  console.log("renderLevel10");
  let interval = React.useRef(null);
  const [count, setCount] = React.useState(0);

  const start = () => {
    if (interval.current !== null) return;
    interval.current = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, 500);
  };

  const stop = () => {
    if (interval.current === null) return;
    clearInterval(interval.current);
    interval.current = null;
  };

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

//bad code - if start is clicked multiple times, setInterval will be called multiple times and cause resource leaks
//check why - https://reactjs.org/docs/hooks-reference.html#useref
export const Level09 = () => {
  let interval = React.useRef(null);
  const [count, setCount] = React.useState(0);

  const start = () => {
    interval.current = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, 500);
  };

  const stop = () => clearInterval(interval.current);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

//bad code - each rerender assigns a new interval and thus stop doesnt work
export const Level08 = () => {
  let interval = null;
  const [count, setCount] = React.useState(0);

  const start = () => {
    interval = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, 500);
  };

  const stop = () => clearInterval(interval);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

//good code - uses same interval instance.
//disposal also happens only once
export const Level07 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("update");
      setCount((count) => count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//bad code - its only a workaround to avoid creating new intervals every 500 ms
export const Level06 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("update");
      setCount(count + 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

// bad code - misleading
// problem - setInterval is created and disposed every 500ms
// each setInterval is called only once
// (here the effect is called on mount and everytime the count changes and the cleanup is called to dispose the old count)
export const Level05 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("update");
      setCount(count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//cleans up resource leaks
//still bad implementation
export const Level04 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("update");
      setCount(count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//bad code - the arrow function will be created once and the value of count is 0.
// this also has a memory leak - always trying to update count from 0 to 1
export const Level03 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      console.log("update");
      setCount(count + 1);
    }, 500);
  }, []);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//bad code - useeffect runs after every render
export const Level02 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => setCount(count + 1), 500);
  });

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//this is bad code - causes memory leak as interval will set on every rerender and will cause resource leak
export const Level01 = () => {
  const [count, setCount] = React.useState(0);

  setInterval(() => setCount(count + 1), 500);

  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};

//this is good code
export const Level00 = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>count => {count}</h1>
      <button onClick={() => setCount(count + 1)}>Start</button>
      <button onClick={() => setCount(count - 1)}>Stop</button>
    </div>
  );
};
