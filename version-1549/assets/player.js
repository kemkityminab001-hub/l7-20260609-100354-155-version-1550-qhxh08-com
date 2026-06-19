(() => {
  const run = () => {
    const video = document.getElementById("movie-video");
    const cover = document.querySelector(".player-cover");

    if (!video) {
      return;
    }

    const streamUrl = video.dataset.streamUrl || "";
    let ready = false;
    let hls = null;

    const prepare = () => {
      if (ready || !streamUrl) {
        return;
      }

      ready = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 45,
          backBufferLength: 30
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = streamUrl;
    };

    const play = () => {
      prepare();
      cover?.classList.add("is-hidden");
      video.controls = true;
      const request = video.play();

      if (request && typeof request.catch === "function") {
        request.catch(() => {
          video.controls = true;
        });
      }
    };

    cover?.addEventListener("click", play);
    video.addEventListener("click", play);
    video.addEventListener("play", () => cover?.classList.add("is-hidden"));

    window.addEventListener("pagehide", () => {
      if (hls) {
        hls.destroy();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
