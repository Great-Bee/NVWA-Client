define('js/util/convert', [], function() {
    ConvertUtil = {
        toPinyin: function(fromInput, identifiedInput) {
            fromInput.on('keydown', function(e) {
                setTimeout(function() {
                    var value = $(e.target).val();
                    if (value) {
                        $nvwa.string.toPinyin(value, function(pinyin) {
                            _log('pinyin->' + pinyin);
                            identifiedInput.val(pinyin);
                            identifiedInput.trigger('keydown');
                        });
                    } else {
                        identifiedInput.val('');
                    }
                }, 100);
            });
        }
    };
    return ConvertUtil;
});