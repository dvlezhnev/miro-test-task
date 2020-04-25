export function InstallPolyfills() {
    InstallReplaceWithPolyfill();
    InstallRemovePolyfill();
}

function InstallReplaceWithPolyfill() {
    // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
    function ReplaceWithPolyfill(this:Element|CharacterData|DocumentType) {
        "use-strict"; // For safari, and IE > 10
        let parent = this.parentNode, i = arguments.length, currentNode;
        if (!parent) return;
        if (!i) // if there are no arguments
            parent.removeChild(this);
        while (i--) { // i-- decrements i and returns the value of i before the decrement
            currentNode = arguments[i];
            if (typeof currentNode !== 'object'){
                currentNode = this.ownerDocument!.createTextNode(currentNode);
            } else if (currentNode.parentNode){
                currentNode.parentNode.removeChild(currentNode);
            }
            // the value of "i" below is after the decrement
            if (!i) // if currentNode is the first argument (currentNode === arguments[0])
                parent.replaceChild(currentNode, this);
            else // if currentNode isn't the first
                parent.insertBefore(currentNode, this.previousSibling);
        }
    }
    if (!Element.prototype.replaceWith)
        Element.prototype.replaceWith = ReplaceWithPolyfill;
    if (!CharacterData.prototype.replaceWith)
        CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
    if (!DocumentType.prototype.replaceWith)
        DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}

function InstallRemovePolyfill() {
    //https://developer.mozilla.org/ru/docs/Web/API/ChildNode/remove
    let arr = [window.Element, window.CharacterData, window.DocumentType];
    let args: any[] = [];

    arr.forEach(function (item) {
        if (item) {
            args.push(item.prototype);
        }
    });

    // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
    (function (arr) {
        arr.forEach(function (item) {
            if (item.hasOwnProperty('remove')) {
                return;
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    this.parentNode.removeChild(this);
                }
            });
        });
    })(args);
}
