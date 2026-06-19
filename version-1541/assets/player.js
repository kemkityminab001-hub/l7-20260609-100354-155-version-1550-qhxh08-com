function initMoviePlayer(options) {
    const video = document.querySelector(options.videoSelector);
    const trigger = document.querySelector(options.triggerSelector);
    const label = trigger ? trigger.querySelector("[data-player-label]") : null;
    let hls = null;
    let initialized = false;

    function setLabel(text) {
        if (label) {
            label.textContent = text;
        }
    }

    function prepare() {
        if (initialized || !video) {
            return;
        }
        initialized = true;
        const source = options.source;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }
        if (options.Hls && options.Hls.isSupported()) {
            hls = new options.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(options.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === options.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                    return;
                }
                if (data.type === options.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                    return;
                }
                setLabel("播放暂时不可用");
                trigger.classList.remove("is-hidden");
            });
            return;
        }
        setLabel("播放暂时不可用");
    }

    async function play() {
        if (!video || !trigger) {
            return;
        }
        prepare();
        setLabel("正在播放");
        trigger.classList.add("is-hidden");
        try {
            await video.play();
        } catch (error) {
            trigger.classList.remove("is-hidden");
            setLabel("点击继续播放");
        }
    }

    function toggleVideo() {
        if (!video) {
            return;
        }
        if (video.paused) {
            play();
        } else {
            video.pause();
        }
    }

    if (trigger) {
        trigger.addEventListener("click", play);
    }
    if (video) {
        video.addEventListener("click", toggleVideo);
        video.addEventListener("play", function () {
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (trigger && video.currentTime > 0 && !video.ended) {
                setLabel("继续播放");
                trigger.classList.remove("is-hidden");
            }
        });
    }
}

window.initMoviePlayer = initMoviePlayer;
