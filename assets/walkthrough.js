/**
 * Like a gallery, only we call it a walkthrough
 * @requires AnimationController, ProgressBarController
 */
var Walkthrough = (function(window, document, AnimationController, ProgressBarController, undefined) {
    'use strict'

    function noop() {}

    function Walkthrough(container, animationFrameDuration) {
        if (!container) {
            throw 'No container element specified'
        }

        this.container = container

        // feature detection for older browsers
        // classList is sufficient because it’s the feature that’s
        // least available of the possible tricky ones (IE10+)
        // if it’s not available, mock the API to avoid console errors
        if (!'classList' in document.body) {
            return {
                next: noop,
                previous: noop,
                setChapter: noop,
                autoPlay: noop,
                stopAutoPlaying: noop
            }
        }

        this.animationFrameDuration = animationFrameDuration || 950 // ms
        this.canAutoPlay = true

        function createChapter(figure, idx) {
            figure.dataset.index = idx
            figcaptions[idx].dataset.index = idx

            var animation = new AnimationController(figure, this.animationFrameDuration)
            var progressBar = new ProgressBarController(figcaptions[idx], this.next.bind(this))

            return {
                figure: figure,
                figcaption: figcaptions[idx],
                animation: animation,
                progressBar: progressBar
            }
        }

        var figures = container.getElementsByTagName('figure')
        var figcaptions = container.getElementsByTagName('figcaption')

        this.chapters = Array.prototype.slice.call(figures, 0).map(createChapter.bind(this))
    }

    Walkthrough.prototype = {
        _getSelectedChapter: function _getSelectedChapter() {
            return this.container.querySelector('figcaption.selected')
        },

        _getItemByIndex: function _getItemByIndex(index) {
            return this.container.querySelector('figcaption[data-index="' + index + '"]')
        },

        // takes a <figcaption> element
        setChapter: function setChapter(figcaption) {
            // shut down any animations currently running
            this.chapters.forEach(function (chapter) {
                chapter.animation.stop()
                chapter.progressBar.reset()
                chapter.figure.classList.remove('selected')
                chapter.figcaption.classList.remove('selected')
            })

            // start the new animation
            var idx = figcaption.dataset.index || 0
            var loop = !this.canAutoPlay
            if (this.chapters && this.chapters[idx]) {
                this.chapters[idx].figure.classList.add('selected')
                this.chapters[idx].figcaption.classList.add('selected')
                this.chapters[idx].animation.start(loop)
                this.canAutoPlay && this.chapters[idx].progressBar.play(this.chapters[idx].animation.duration)
            }
        },

        next: function next() {
            if (!this.canAutoPlay) {
                return
            }

            var selected = this._getSelectedChapter()
            var index
            var nextItem

            if (selected) {
                index = selected.dataset.index
                if (index !== undefined) {
                    ++index
                    nextItem = this._getItemByIndex(index)
                    if (nextItem) {
                        this.setChapter(nextItem)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        },

        previous: function previous() {
            var selected = this._getSelectedChapter()
            var index
            var prevItem

            if (selected) {
                index = selected.dataset.index
                if (index !== undefined) {
                    --index
                    prevItem = this._getItemByIndex(index)
                    if (prevItem) {
                        this.setChapter(prevItem)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        },

        disableAutoPlay: function stopAutoPlaying() {
            this.canAutoPlay = false
        },

        autoPlay: function autoPlay() {
            var selected = this._getSelectedChapter()
            var index

            if (selected) {
                index = selected.dataset.index
                if (undefined !== index) {
                    if (index > 0) {
                        this.next()
                    }
                    else {
                        this.setChapter(selected)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        }
    }

    return Walkthrough

}).call(this, this, this.document, AnimationController, ProgressBarController)
