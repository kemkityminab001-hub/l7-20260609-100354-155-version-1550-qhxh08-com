(function () {
    "use strict";

    function mount(configuration) {
        var video = document.querySelector(configuration.videoSelector);
        var layer = document.querySelector(configuration.layerSelector);
        var buttons = Array.prototype.slice.call(document.querySelectorAll(configuration.buttonSelector));
        var source = configuration.source;
        var hls = null;
        var loaded = false;

        if (!video || !source) {
            return;
        }

        function loadSource() {
            if (loaded) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            loaded = true;
        }

        function hideLayer() {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        }

        function showLayer() {
            if (layer) {
                layer.classList.remove("is-hidden");
            }
        }

        function play() {
            loadSource();
            hideLayer();
            video.setAttribute("controls", "controls");
            var attempt = video.play();

            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    showLayer();
                });
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                play();
            });
        });

        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", hideLayer);
        video.addEventListener("ended", showLayer);
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.MoviePlayer = {
        mount: mount
    };
}());
