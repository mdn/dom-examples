const extraKeepAliveMs = 4 * 60 * 1000;
let curKeepAliveResolve = null;
let curKeepAliveTimer = 0;

function keepAliveTimerFired() {
  if (curKeepAliveResolve) {
    curKeepAliveResolve();
    curKeepAliveResolve = null;
    curKeepAliveTimer = 0;
  }
}

/**
 * In order to keep the ServiceWorker's global state around for a while,
 * always maintain the most-recent postMessage event as providing cover for
 * extraKeepAliveMs.
 */
function ensureKeepAlive(evt) {
  if (curKeepAliveResolve) {
    curKeepAliveResolve();
    clearTimeout(curKeepAliveTimer);
  }

  evt.waitUntil(
    new Promise((resolve) => {
      curKeepAliveResolve = resolve;
      curKeepAliveTimer = setTimeout(keepAliveTimerFired, extraKeepAliveMs);
    }),
  );
}

addEventListener("message", function (evt) {
  let { generation, str } = evt.data;

  let result;
  try {
    result = eval(str) + "";
  } catch (ex) {
    result = "Exception: " + ex;
  }

  evt.source.postMessage({
    generation,
    result,
  });

  ensureKeepAlive(evt);
});
