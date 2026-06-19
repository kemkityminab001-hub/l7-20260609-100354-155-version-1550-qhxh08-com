document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".player-frame").forEach(function (frame) {
        var video = frame.querySelector("video");
        var cover = frame.querySelector("[data-play]");
        var streamUrl = video ? video.getAttribute("data-stream") : "";
        var attached = false;

        function attachStream() {
            if (!video || !streamUrl || attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function playVideo() {
            attachStream();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            if (video) {
                var request = video.play();
                if (request && typeof request.catch === "function") {
                    request.catch(function () {});
                }
            }
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener("play", function () {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
            });
        }
    });
});
