/**
 * Controls display of the animation progress bar
 */
var ProgressBarController = (function(window, document, undefined) {
    'use strict'

    function ProgressBarController(el, callback) {
        if (!el) {
            throw 'No element specified'
        }
        // add the progress bar element
        this.progressBar = document.createElement('SPAN')
        this.progressBar.classList.add('progress-bar')
        el.appendChild(this.progressBar)
        this.canPlay
        this.callback = callback || function noop() {}
    }

    ProgressBarController.prototype = {
        _update: function _update(pct) {
            var pb = this.progressBar
            requestAnimationFrame(function () {
                pb.style.height = pct + '%'
            })
        },

        reset: function reset() {
            this.canPlay = false
            this._update(0)
        },

        play: function play(ms) {
            this.canPlay = true

            var start = +new Date
            var end = start + ms

            function tick() {
                var current = +new Date
                var msToEnd = end - current
                var pct = (1 - (msToEnd / ms)) * 100

                this._update(pct)

                if (this.canPlay) {
                    if (current < end) {
                        requestAnimationFrame(tick)
                    }
                    else {
                        this.reset()
                        this.callback()
                    }
                }
            }

            tick = tick.bind(this)

            requestAnimationFrame(tick)
        }
    }

    return ProgressBarController

}).call(this, this, this.document)
