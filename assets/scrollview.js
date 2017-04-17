/**
 * Answering the question: Is it in view?
 * @requires jQuery
 */
var ScrollView = (function(window, document, $, undefined) {
    'use strict'

    function ScrollView(el, thresholds) {
        if (!el) {
            throw 'No element specified'
        }

        this.el = el

        // default to 80% of the element showing
        this.thresholds = thresholds || {
            top: 0.79,
            bottom: 1.81
        }
    }

    ScrollView.prototype = {
        isInView: function isInView() {
            // compute these every time in case the user has resized the browser
            var scrollTop = $(window).scrollTop()
            var viewportHeight = $(window).height()
            var fromTop = $(this.el).offset().top
            var elHeight = $(this.el).height()

            // maths
            var scrollBottom = scrollTop + viewportHeight
            var elBottom = fromTop + elHeight
            var bottomDiff = elBottom - scrollBottom
            var percentageShowing = 1 - (bottomDiff / elHeight)

            return percentageShowing > this.thresholds.top && percentageShowing < this.thresholds.bottom
        }
    }

    return ScrollView

}).call(this, this, this.document, jQuery)
