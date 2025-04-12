// stats.js r6 - http://github.com/mrdoob/stats.js

var Stats = function () {
    function updateGraph(data, value, type) {
        var x, y, index;
        for (y = 0; y < 30; y++) {
            for (x = 0; x < 73; x++) {
                index = (x + y * 74) * 4;
                data[index] = data[index + 4];
                data[index + 1] = data[index + 5];
                data[index + 2] = data[index + 6];
            }
        }
        for (y = 0; y < 30; y++) {
            index = (73 + y * 74) * 4;
            if (y < value) {
                data[index] = colors[type].bg.r;
                data[index + 1] = colors[type].bg.g;
                data[index + 2] = colors[type].bg.b;
            } else {
                data[index] = colors[type].fg.r;
                data[index + 1] = colors[type].fg.g;
                data[index + 2] = colors[type].fg.b;
            }
        }
    }

    var mode = 0,
        modes = 2,
        frames = 0,
        time = (new Date()).getTime(),
        prevTime = time,
        minFPS = 1e3,
        maxFPS = 0,
        fpsPanel, msPanel, mbPanel,
        fpsCanvas, msCanvas, mbCanvas,
        fpsContext, msContext, mbContext,
        fpsImageData, msImageData, mbImageData,
        colors = {
            fps: { bg: { r: 16, g: 16, b: 48 }, fg: { r: 0, g: 255, b: 255 } },
            ms: { bg: { r: 16, g: 48, b: 16 }, fg: { r: 0, g: 255, b: 0 } },
            mb: { bg: { r: 48, g: 16, b: 26 }, fg: { r: 255, g: 0, b: 128 } }
        };

    var container = document.createElement("div");
    container.style.cursor = "pointer";
    container.style.width = "80px";
    container.style.opacity = "0.9";
    container.style.zIndex = "10001";
    container.addEventListener("click", function () {
        mode = (mode + 1) % modes;
        fpsPanel.style.display = "none";
        msPanel.style.display = "none";
        mbPanel.style.display = "none";
        if (mode === 0) fpsPanel.style.display = "block";
        if (mode === 1) msPanel.style.display = "block";
        if (mode === 2) mbPanel.style.display = "block";
    }, false);

    // FPS Panel
    fpsPanel = document.createElement("div");
    fpsPanel.style.backgroundColor = `rgb(${Math.floor(colors.fps.bg.r / 2)},${Math.floor(colors.fps.bg.g / 2)},${Math.floor(colors.fps.bg.b / 2)})`;
    fpsPanel.style.padding = "2px 0px 3px 0px";
    container.appendChild(fpsPanel);

    var fpsText = document.createElement("div");
    fpsText.style.fontFamily = "Helvetica, Arial, sans-serif";
    fpsText.style.textAlign = "left";
    fpsText.style.fontSize = "9px";
    fpsText.style.color = `rgb(${colors.fps.fg.r},${colors.fps.fg.g},${colors.fps.fg.b})`;
    fpsText.style.margin = "0px 0px 1px 3px";
    fpsText.innerHTML = '<span style="font-weight:bold">FPS</span>';
    fpsPanel.appendChild(fpsText);

    fpsCanvas = document.createElement("canvas");
    fpsCanvas.width = 74;
    fpsCanvas.height = 30;
    fpsCanvas.style.display = "block";
    fpsCanvas.style.marginLeft = "3px";
    fpsPanel.appendChild(fpsCanvas);

    fpsContext = fpsCanvas.getContext("2d");
    fpsContext.fillStyle = `rgb(${colors.fps.bg.r},${colors.fps.bg.g},${colors.fps.bg.b})`;
    fpsContext.fillRect(0, 0, fpsCanvas.width, fpsCanvas.height);
    fpsImageData = fpsContext.getImageData(0, 0, fpsCanvas.width, fpsCanvas.height);

    // MS Panel
    msPanel = document.createElement("div");
    msPanel.style.backgroundColor = `rgb(${Math.floor(colors.ms.bg.r / 2)},${Math.floor(colors.ms.bg.g / 2)},${Math.floor(colors.ms.bg.b / 2)})`;
    msPanel.style.padding = "2px 0px 3px 0px";
    msPanel.style.display = "none";
    container.appendChild(msPanel);

    var msText = document.createElement("div");
    msText.style.fontFamily = "Helvetica, Arial, sans-serif";
    msText.style.textAlign = "left";
    msText.style.fontSize = "9px";
    msText.style.color = `rgb(${colors.ms.fg.r},${colors.ms.fg.g},${colors.ms.fg.b})`;
    msText.style.margin = "0px 0px 1px 3px";
    msText.innerHTML = '<span style="font-weight:bold">MS</span>';
    msPanel.appendChild(msText);

    msCanvas = document.createElement("canvas");
    msCanvas.width = 74;
    msCanvas.height = 30;
    msCanvas.style.display = "block";
    msCanvas.style.marginLeft = "3px";
    msPanel.appendChild(msCanvas);

    msContext = msCanvas.getContext("2d");
    msContext.fillStyle = `rgb(${colors.ms.bg.r},${colors.ms.bg.g},${colors.ms.bg.b})`;
    msContext.fillRect(0, 0, msCanvas.width, msCanvas.height);
    msImageData = msContext.getImageData(0, 0, msCanvas.width, msCanvas.height);

    // MB Panel
    mbPanel = document.createElement("div");
    mbPanel.style.backgroundColor = `rgb(${Math.floor(colors.mb.bg.r / 2)},${Math.floor(colors.mb.bg.g / 2)},${Math.floor(colors.mb.bg.b / 2)})`;
    mbPanel.style.padding = "2px 0px 3px 0px";
    mbPanel.style.display = "none";
    container.appendChild(mbPanel);

    var mbText = document.createElement("div");
    mbText.style.fontFamily = "Helvetica, Arial, sans-serif";
    mbText.style.textAlign = "left";
    mbText.style.fontSize = "9px";
    mbText.style.color = `rgb(${colors.mb.fg.r},${colors.mb.fg.g},${colors.mb.fg.b})`;
    mbText.style.margin = "0px 0px 1px 3px";
    mbText.innerHTML = '<span style="font-weight:bold">MB</span>';
    mbPanel.appendChild(mbText);

    mbCanvas = document.createElement("canvas");
    mbCanvas.width = 74;
    mbCanvas.height = 30;
    mbCanvas.style.display = "block";
    mbCanvas.style.marginLeft = "3px";
    mbPanel.appendChild(mbCanvas);

    mbContext = mbCanvas.getContext("2d");
    mbContext.fillStyle = "#301010";
    mbContext.fillRect(0, 0, mbCanvas.width, mbCanvas.height);
    mbImageData = mbContext.getImageData(0, 0, mbCanvas.width, mbCanvas.height);

    return {
        domElement: container,
        update: function () {
            frames++;
            var now = (new Date()).getTime();
            var ms = now - prevTime;
            minFPS = Math.min(minFPS, ms);
            maxFPS = Math.max(maxFPS, ms);

            updateGraph(msImageData.data, Math.min(30, 30 - ms / 200 * 30), "ms");
            msText.innerHTML = `<span style="font-weight:bold">${ms} MS</span> (${minFPS}-${maxFPS})`;
            msContext.putImageData(msImageData, 0, 0);

            prevTime = now;

            if (now > time + 1000) {
                var fps = Math.round((frames * 1000) / (now - time));
                minFPS = Math.min(minFPS, fps);
                maxFPS = Math.max(maxFPS, fps);

                updateGraph(fpsImageData.data, Math.min(30, 30 - fps / 100 * 30), "fps");
                fpsText.innerHTML = `<span style="font-weight:bold">${fps} FPS</span> (${minFPS}-${maxFPS})`;
                fpsContext.putImageData(fpsImageData, 0, 0);

                time = now;
                frames = 0;
            }
        }
    };
};