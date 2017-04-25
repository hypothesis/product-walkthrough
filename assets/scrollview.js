/**
 * Answering the question: Is it in view?
 * @requires jQuery
 */
var ScrollView = (function(window, document, $, undefined) {
    'use strict'

    function ScrollView(el) {
        if (!el) {
            throw 'No element specified'
        }

        // this.el = el
        this.el = (function (el) {
            if (typeof jQuery === 'function' && el instanceof jQuery) {
                el = el[0]
            }
            return el
        }(el))
    }

    ScrollView.prototype = {
        // based on http://stackoverflow.com/a/7557433/11577
        isInView: function isInView() {
            var rect = this.el.getBoundingClientRect()

            var topInView = rect.top >= 0
            var rightInView = rect.right <= $(window).width()
            var bottomInView = rect.bottom <= $(window).height()
            var leftInView = rect.left >= 0

            return topInView && rightInView && bottomInView && leftInView
        }
    }

    return ScrollView

}).call(this, this, this.document, jQuery)
