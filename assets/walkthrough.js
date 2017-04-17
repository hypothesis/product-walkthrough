/**
 * Like a gallery, only we call it a walkthrough
 * @requires AnimationController, ProgressBarController
 */
var Walkthrough = (function(window, document, AnimationController, ProgressBarController, undefined) {
    'use strict'

    function noop() {}

    function Walkthrough(container, animationFrameDuration) {
        if (!container) {
            throw 'No element specified'
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
                setItem: noop,
                autoPlay: noop,
                stopAutoPlaying: noop
            }
        }

        this.animationFrameDuration = animationFrameDuration || 950 // ms
        this.canAutoPlay = true

        function createItem(item, idx) {
            item.dataset.index = idx
            var animation = new AnimationController(item.querySelector('.images'), this.animationFrameDuration)
            var progressBar = new ProgressBarController(item.querySelector('figcaption'), this.next.bind(this))
            return {
                container: item,
                animation: animation,
                progressBar: progressBar
            }
        }

        var figures = this.container.getElementsByTagName('figure')

        this.items = Array.prototype.slice.call(figures, 0).map(createItem.bind(this))
    }

    Walkthrough.prototype = {
        _getSelectedItem: function _getSelectedItem() {
            return document.querySelector('.walkthrough > figure.selected')
        },

        _getItemByIndex: function _getItemByIndex(index) {
            return document.querySelector('.walkthrough > figure[data-index="' + index + '"]')
        },

        // takes a <figure> element (container for a gallery item)
        setItem: function setItem(el) {
            // shut down any animations currently running
            this.items.forEach(function (item) {
                item.animation.stop()
                item.progressBar.reset()
                item.container.classList.remove('selected')
            })

            // start the new animation
            var idx = el.dataset.index || 0
            if (this.items && this.items[idx]) {
                this.items[idx].container.classList.add('selected')
                this.items[idx].animation.start()
                this.items[idx].progressBar.play(this.items[idx].animation.duration)
            }
        },

        next: function next() {
            if (!this.canAutoPlay) {
                return
            }

            var selected = this._getSelectedItem()
            var index
            var nextItem

            if (selected) {
                index = selected.dataset.index
                if (index !== undefined) {
                    ++index
                    nextItem = this._getItemByIndex(index)
                    if (nextItem) {
                        this.setItem(nextItem)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        },

        previous: function previous() {
            var selected = this._getSelectedItem()
            var index
            var prevItem

            if (selected) {
                index = selected.dataset.index
                if (index !== undefined) {
                    --index
                    prevItem = this._getItemByIndex(index)
                    if (prevItem) {
                        this.setItem(prevItem)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        },

        disableAutoPlay: function stopAutoPlaying() {
            this.canAutoPlay = false
        },

        autoPlay: function autoPlay() {
            var selected = this._getSelectedItem()
            var index

            if (selected) {
                index = selected.dataset.index
                if (undefined !== index) {
                    if (index > 0) {
                        this.next()
                    }
                    else {
                        this.setItem(selected)
                    }
                }
            }
            // if any of the above conditions fail, just fail silently
        }
    }

    return Walkthrough

}).call(this, this, this.document, AnimationController, ProgressBarController)
