var HandleSwipes = (function(window, document, undefined) {
    'use strict'

    function HandleSwipes(el, callbacks) {
        if (!el) {
            throw 'No element specified'
            return {}
        }

        this.el = el

        function noop() {}

        this.swipeThreshold = 24 // px

        this.swipeLeft = callbacks.swipeLeft || noop
        this.swipeRight = callbacks.swipeLeft || noop
        this.swipeUp = callbacks.swipeLeft || noop
        this.swipeDown = callbacks.swipeLeft || noop

        this.startPos = { x: null, y: null }
        this.endPos = { x: null, y: null }

        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)

        this.addEventListener()
    }

    HandleSwipes.prototype = {
        addEventListener: function addEventListener() {
            this.el.addEventListener('touchstart', this.handleTouchStart)
        },

        handleTouchStart: function handleTouchStart(evt) {
            // save start position
            this.startPos.x = evt.pageX
            this.startPos.y = evt.pageY

            // add listener for touchend
            this.el.addEventListener('touchend', this.handleTouchEnd)
        },

        handleTouchEnd: function handleTouchEnd(evt) {
            // get end position
            this.endPos.x = evt.pageX
            this.endPos.y = evt.pageY

            // detach touchend listener
            this.el.removeEventListener('touchend', this.handleTouchEnd)

            if (this.isSwipe()) {
                // call the callback for the swipe direction
                this[this.swipeDirection()]()
            }
        },

        // it’s a swipe if the user moves their finger more than
        // the swipe threshold while touching the screen
        isSwipe: function isSwipe() {
            return (Math.abs(this.startPos.x - this.endPos.x) > this.swipeThreshold) || (Math.abs(this.endPos.y - this.endPos.y) > this.swipeThreshold)
        },

        // return the swipe direction
        swipeDirection: function swipeDirection() {
            var swipeDir

            var xDiff = this.startPos.x - this.endPos.x
            var yDiff = this.endPos.y - this.endPos.y

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                // left/right
                swipeDir = xDiff > 0 ? 'swipeLeft' : 'swipeRight'
            }
            else {
                // up/down
                swipeDir = yDiff > 0 ? 'swipeUp' : 'swipeDown'
            }

            return swipeDir
        }
    }

    return HandleSwipes

}).call(this, this, this.document)
