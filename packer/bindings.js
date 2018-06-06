var packer = new Packer;

new base2.JSB.RuleList({
    "#input,#output": {
        disabled: false,
        spellcheck: false // for mozilla
    },
    "#pack-script": {
        disabled: false,
        onclick: function() {
            try {
                output.value = "";
                if (input.value) {
                    var value = packer.pack(input.value, base62.checked);
                    output.value = value;
                    message.update();
                }
            } catch (error) {
                message.error("error packing script", error);
            }
        }
    },
    "#base62": {
        disabled: false
    },
    "#message": {
        error: function(text, error) {
            this.write(text + ": " + error.message, "error");
        },
        update: function(message) {
            var length = input.value.length;
            if (!/\r/.test(input.value)) { // mozilla trims carriage returns
                length += match(input.value, /\n/g).length;
            }
            var calc = output.value.length + "/" + length;
            var ratio = (output.value.length / length).toFixed(3);
            this.write((message ? message + ", " : "") + format("compression ratio: %1=%2", calc, ratio));
        },
        write: function(text, className) {
            this.innerHTML = text;
            this.className = className || "";
        }
    }
});