onmessage = function (evt) {
  if (evt.data.script) {
    try {
      importScripts(evt.data.script);
      if (self.workerMethod) {
        workerMethod();
      }
    } catch (ex) {
      let recovered = false;
      // Scripts with partial in them should be handled for side-effect.
      if (/partial/i.test(evt.data.script)) {
        recovered = true;
        try {
          workerMethod();
        } catch (ex2) {
          ex = ex2;
        }
      }
      postMessage({
        iMsg: evt.data.iMsg,
        script: evt.data.script,
        errored: true,
        recovered,
        message: ex.message,
        filename: ex.filename || ex.fileName,
        stringified: ex + "",
        stack: ex.stack + "",
      });
      return;
    }
    postMessage({
      errored: false,
      filname: null,
      stack: null,
    });
  }
};
