define([
    'jquery'
], function(){
    'use strict';

    var Message, defaults;

    defaults = {
        type: 'default',
        timeout: 2000,
        stackSize: null,
        animate: true,
        animateDuration: 300,
        animateClass: 'messages-animate',
        hideClass: 'messages-out'
    };

    Message = function(options){
        var wrapper, tpl, message, oversized;

        wrapper = $('.messages-wrapper');
        if(!wrapper.length){
            wrapper = $('<div class="messages-wrapper"></div>');
            $(document.body).append(wrapper);
        }
        tpl = '<div class="messages"></div>';
        options = $.extend({}, defaults, options);

        message = $(tpl);
        message.append('<i class="messages-icon messages-icon-' + options.type + '"></i>')
        .append('<span class="messages-msg">' + options.msg + '</span>')
        .addClass('messages-' + options.type);
        wrapper.prepend(message);
        wrapper.css('z-index', 99999);

        if(options.animate){
            message.addClass(options.hideClass).addClass(options.animateClass);
            options.timeout += options.animateDuration;
            setTimeout(function(){
                message.removeClass(options.hideClass);
            }, 0);
        }

        setTimeout(function(){
            if(options.animate){
                message.addClass(options.hideClass);
            }
            else{
                options.animateDuration = 0;
            }
            setTimeout(function(){
                message.remove();
                if(wrapper.find('div.messages').length === 0){
                    wrapper.css('z-index', -1);
                }
            }, options.animateDuration);
        }, options.timeout);

        if(options.stackSize){
            oversized = wrapper.find('.messages:gt(' + (options.stackSize - 1) + ')');
            oversized.addClass(options.hideClass);
            setTimeout(function(){
                oversized.remove();
            }, options.animateDuration);
        }

    };

    return Message;
});
