(function () {
  function mountVideoPlayer(rootId, source) {
    var root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var button = root.querySelector(".player-start");
    var loading = root.querySelector(".player-loading");
    var error = root.querySelector(".player-error");
    var readyPromise = null;

    function showLoading(show) {
      if (loading) {
        loading.hidden = !show;
      }
    }

    function showError(show) {
      if (error) {
        error.hidden = !show;
      }
    }

    function prepare() {
      if (!video) {
        return Promise.reject(new Error("video"));
      }

      if (readyPromise) {
        return readyPromise;
      }

      showError(false);
      showLoading(true);
      video.controls = true;

      readyPromise = new Promise(function (resolve) {
        var Hls = window.Hls;
        var settled = false;

        function done() {
          if (!settled) {
            settled = true;
            showLoading(false);
            resolve();
          }
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener("loadedmetadata", done, { once: true });
          window.setTimeout(done, 900);
          return;
        }

        if (Hls && Hls.isSupported()) {
          var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          root._hls = hls;
          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            hls.loadSource(source);
          });
          hls.on(Hls.Events.MANIFEST_PARSED, done);
          hls.on(Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showLoading(false);
              showError(true);
            }
          });
          window.setTimeout(done, 2200);
          return;
        }

        video.src = source;
        video.addEventListener("loadedmetadata", done, { once: true });
        window.setTimeout(done, 900);
      });

      return readyPromise;
    }

    function play() {
      if (!video) {
        return;
      }

      if (button) {
        button.classList.add("is-hidden");
      }

      prepare().then(function () {
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {
            if (button) {
              button.classList.remove("is-hidden");
            }
          });
        }
      }).catch(function () {
        showLoading(false);
        showError(true);
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    }

    if (button) {
      button.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
    }
  }

  window.mountVideoPlayer = mountVideoPlayer;
})();
