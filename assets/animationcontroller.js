/**
 * Controls swapping through frames of an individual animation
 */
var AnimationController = (function(window, document, undefined) {
    'use strict'

    function AnimationController(container, msPerFrame) {
        if (!container) {
            throw 'No container specified'
        }

        this.container = container
        this.frames = Array.prototype.slice.call(this.container.getElementsByTagName('img'), 0)
        this.currentFrameIndex = 0
        this.msPerFrame = msPerFrame || 1000
        this.duration = this.frames.length * this.msPerFrame
        this.timer
    }

    AnimationController.prototype = {
        _setFrame: function _setFrame(frame) {
            this.frames.forEach(function (frame) {
                frame.classList.remove('selected')
            })
            frame.classList.add('selected')
        },

        _nextFrame: function _nextFrame() {
            ++this.currentFrameIndex
            if (this.frames[this.currentFrameIndex]) {
                this._setFrame(this.frames[this.currentFrameIndex])
            }
        },

        start: function play() {
            this.currentFrameIndex = 0
            this._setFrame(this.frames[this.currentFrameIndex])
            this.timer = setInterval(this._nextFrame.bind(this), this.msPerFrame)
            setTimeout(this.stop.bind(this), this.duration)
        },

        stop: function stop() {
            clearInterval(this.timer)
        }
    }

    return AnimationController

}).call(this, this, this.document)
