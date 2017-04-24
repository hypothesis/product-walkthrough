/**
 * Product Walkthrough Initializer
 * @requires jQuery, jQuery scrollTo plugin, Walkthrough, ScrollView, HandleSwipes
 */

(function (window, document, $, Walkthrough, ScrollView, HandleSwipes, undefined) {
    'use strict'

    function addEvents(container) {
        // initialize walkthrough
        var walkthrough = new Walkthrough(container)

        var ticking = false // used for scroll debouncing
        var scrollView = new ScrollView(container)

        // debounced scroll handling
        function handleScroll(evt) {
            // if a request is already queued, don’t queue up another one
            if (!ticking) {
                requestAnimationFrame(handleNewScrollPosition)
                ticking = true
            }
        }

        function handleNewScrollPosition() {
            // allow a new scroll event to be handled
            ticking = false

            // if the walkthrough is in-view, start autoplaying
            if (scrollView.isInView()) {
                walkthrough.autoPlay()

                // only autoplay once per page load
                document.removeEventListener('scroll', handleScroll)
            }
        }

        function handleClick(evt) {
            evt.preventDefault()
            if (evt.srcElement.matches('figcaption')) {
                // once the user interacts with the walkthrough, stop auto-playing
                walkthrough.disableAutoPlay()

                // we know the item the user clicked on, so go straight to it
                walkthrough.setChapter(evt.srcElement)
            }
        }

        function handleSwipeLeft() {
            // once the user interacts with the walkthrough, stop auto-playing
            walkthrough.disableAutoPlay()

            walkthrough.next()
        }

        function handleSwipeRight() {
            // once the user interacts with the walkthrough, stop auto-playing
            walkthrough.disableAutoPlay()

            walkthrough.previous()
        }

        // initialize swipe handling
        new HandleSwipes(container, {
            swipeLeft: handleSwipeLeft,
            swipeRight: handleSwipeRight
        })

        // initialize click handling
        container.addEventListener('click', handleClick)

        // initialize scroll detection
        document.addEventListener('scroll', handleScroll)
    }

    function init() {
        // add event handlers
        addEvents(document.querySelector('.walkthrough'))
    }

    document.addEventListener('DOMContentLoaded', init)

}.call(this, this, this.document, jQuery, Walkthrough, ScrollView, HandleSwipes))
