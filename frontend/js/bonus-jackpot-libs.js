/**
 * PHASETIPS is a tooltip plugin for Phaser.io HTML5 game framework
 *
 * COPYRIGHT-2015
 * AUTHOR: MICHAEL DOBEKIDIS (NETGFX.COM)
 *
 **/

var Phasetips = function(localGame, options) {

    var _this = this;
    var _options = options || {};
    var game = localGame || game; // it looks for a game object or falls back to the global one

    this.printOptions = function() {
        window.console.log(_options);
    };

    this.onHoverOver = function() {
        if (_this.tweenObj) {
            _this.tweenObj.stop();
        }

        if (_options.animation === "fade") {
            _this.tweenObj = game.add.tween(_this.mainGroup).to({
                alpha: 1
            }, _options.animationSpeedShow, Phaser.Easing.Linear.None, true, _options.animationDelay, 0, false);
        } else if (_options.animation === "slide") {

        } else if (_options.animation === "grow") {

            _this.mainGroup.pivot.setTo(_this.mainGroup.width / 2, _this.mainGroup.height);
            _this.mainGroup.pivot.setTo(_this.mainGroup.width / 2, _this.mainGroup.height);
            _this.mainGroup.x = _this.mainGroup.initialX + _this.mainGroup.width / 2;
            _this.mainGroup.y = _this.mainGroup.initialY + _this.mainGroup.height;
            _this.mainGroup.scale.setTo(0, 0);
            _this.mainGroup.alpha = 1;
            _this.tweenObj = game.add.tween(_this.mainGroup.scale).to({
                x: 1,
                y: 1
            }, _options.animationSpeedShow, Phaser.Easing.Linear.None, true, _options.animationDelay, 0, false);
        } else {
            _this.mainGroup.visible = true;
            _this.mainGroup.alpha = 1;
        }

        if (_options.onHoverCallback) {
            _options.onHoverCallback(_this);
        }
    };

    this.onHoverOut = function() {
        if (_this.tweenObj) {
            _this.tweenObj.stop();
        }

        if (_options.animation === "fade") {
            _this.tweenObj = game.add.tween(_this.mainGroup).to({
                alpha: 0
            }, _options.animationSpeedHide, Phaser.Easing.Linear.None, true, 0, 0, false);
        } else {
            _this.mainGroup.alpha = 0;
        }

        if (_options.onOutCallback) {
            _options.onOutCallback(_this);
        }
    };

    this.createTooltips = function() {

        // layout
        var _width = _options.width || "auto";
        var _height = _options.height || "auto";
        var _x = _options.x || "auto";
        var _y = _options.y || "auto";
        var _padding = _options.padding === undefined ? 20 : _options.padding;
        var _positionOffset = _options.positionOffset === undefined ? 20 : _options.positionOffset;
        var _bgColor = _options.backgroundColor || 0x000000;
        var _strokeColor = _options.strokeColor || 0xffffff;
        var _strokeWeight = _options.strokeWeight || 2;
        var _customArrow = _options.customArrow || false;
        var _enableCursor = _options.enableCursor || false;
        var _customBackground = _options.customBackground || false;
        var _fixedToCamera = _options.fixedToCamera || false;
        // Option for rounded corners
        var _roundedCornersRadius = _options.roundedCornersRadius || 1;
        // Option for font style
        var _font = _options.font || '';
        var _fontSize = _options.fontSize || 12;
        var _fontFill = _options.fontFill || "#ffffff";
        var _fontStroke = _options.fontStroke || "#1e1e1e";
        var _fontStrokeThickness = _options.fontStrokeThickness || 1;
        var _fontWordWrap = _options.fontWordWrap || true;
        var _fontWordWrapWidth = _options.fontWordWrapWidth || 200;
        // Text style properties
        var _textStyle = _options.textStyle || {
            font: _font,
            fontSize: _fontSize,
            fill: _fontFill,
            stroke: _fontStroke,
            strokeThickness: _fontStrokeThickness,
            wordWrap: _fontWordWrap,
            wordWrapWidth: _fontWordWrapWidth
        };

        //
        var _position = _options.position || "top"; // top, bottom, left, right, auto(?)
        var _animation = _options.animation || "fade"; // fade, slide, grow, none to manually show it
        var _animationDelay = _options.animationDelay || 0;
        var _content = _options.context || "Hello World"; // string, bitmapText, text, sprite, image, group
        var _object = _options.targetObject || game; // any object
        var _animationSpeedShow = _options.animationSpeedShow || 300;
        var _animationSpeedHide = _options.animationSpeedHide || 200;
        var _onHoverCallback = _options.onHoverCallback || function() {};
        var _onOutCallback = _options.onOutCallback || function() {};
        // If disableInputEvents option is set to true, the tooltip will not fade in or out upon hover.
        // Use simulateOnHoverOver, simulateOnHoverOut, hideTooltip or showTooltip methods to manually control the visibility.
        var _disableInputEvents = _options.disableInputEvents || false;

        _options.animation = _animation;
        _options.animationDelay = _animationDelay;
        _options.animationSpeedShow = _animationSpeedShow;
        _options.animationSpeedHide = _animationSpeedHide;
        _options.onHoverCallback = _onHoverCallback;
        _options.onOutCallback = _onOutCallback;

        ////////////////////////////////////////////////////////////////////////////////////
        var tooltipBG;
        var tooltipContent;
        var tooltipArrow;

        _this.mainGroup = game.add.group();
        var mainGroup = _this.mainGroup;

        // add content first to calculate width & height in case of auto
        var type = typeof _content;

        if (type === "string" || type === "number") {
            tooltipContent = new Phaser.Text(game, _padding / 2, _padding / 2, String(_content), _textStyle);
            tooltipContent.lineSpacing = _textStyle.lineSpacing || 0;
            tooltipContent.updateText();
            tooltipContent.update();
            tooltipContent.x = _padding / 2;
            tooltipContent.y = _padding / 2;
            var bounds = tooltipContent.getBounds();
            /* window.console.log(bounds);
             var debug = game.add.graphics(bounds.width, bounds.height);
             debug.x = _padding/2;
             debug.y = _padding/2;
             debug.beginFill(0xff0000, 0.6);
             debug.drawRect(0, 0, bounds.width, bounds.height, 1);
             window.console.log(debug.x)*/
        } else if (type === "object") {
            tooltipContent = _content;
        }

        if (_width !== "auto" && _height !== "auto") {
            mainGroup.width = _width;
            mainGroup.height = _height;
        } else {
            if (_customBackground === false) {
                mainGroup.width = tooltipContent.width + _padding;
                mainGroup.height = tooltipContent.height + _padding;
            } else {

                if (_customBackground.width > tooltipContent.width) {
                    mainGroup.width = _customBackground.width;
                    mainGroup.height = _customBackground.height;
                } else {
                    mainGroup.width = tooltipContent.width;
                    mainGroup.height = tooltipContent.height;
                }
            }
        }

        // Making it invisible
        mainGroup.alpha = 0;
        //////////////////////
        function updatePosition() {
            var _origPosition = _position;
            if (_x !== "auto" && _y !== "auto") {
                mainGroup.x = _x;
                mainGroup.y = _y;
                if (_fixedToCamera == true) {
                    mainGroup.fixedToCamera = true;
                    mainGroup.cameraOffset.setTo(mainGroup.x, mainGroup.y);
                }
            } else {
                var worldPos = _options.targetObject ? _options.targetObject.world : game.world;
                objectX = worldPos.x || _options.targetObject.x;
                objectY = worldPos.y || _options.targetObject.y;

                // sanity check
                if (_position === "bottom") {
                    if (Math.round(objectY + _object.height + (_positionOffset)) + mainGroup._height > game.height) {
                        _position = "top";
                    }
                } else if (_position === "top") {
                    if (Math.round(objectY - (_positionOffset + mainGroup._height)) < 0) {
                        _position = "bottom";
                    }
                }

                if (_position === "top") {
                    mainGroup.x = Math.round(objectX + ((_object.width / 2) - (mainGroup._width / 2)));
                    mainGroup.y = Math.round(objectY - (_positionOffset + mainGroup._height));
                } else if (_position === "bottom") {
                    mainGroup.x = Math.round(objectX + ((_object.width / 2) - (mainGroup._width) / 2));
                    mainGroup.y = Math.round(objectY + _object.height + (_positionOffset));
                } else if (_position === "left") {
                    mainGroup.x = Math.round(objectX - (_positionOffset + mainGroup._width));
                    mainGroup.y = Math.round((objectY + _object.height / 2) - (mainGroup._height / 2));
                    // mainGroup.scale.x = -1;
                } else if (_position === "right") {
                    mainGroup.x = Math.round(objectX + _object.width + _positionOffset);
                    mainGroup.y = Math.round((objectY + _object.height / 2) - (mainGroup._height / 2));
                }

                if (_fixedToCamera == true) {
                    mainGroup.fixedToCamera = true;
                    mainGroup.cameraOffset.setTo(mainGroup.x, mainGroup.y);
                }
            }

            // clone world position
            mainGroup.initialWorldX = worldPos.x;
            mainGroup.initialWorldY = worldPos.y;

            mainGroup.initialX = mainGroup.x;
            mainGroup.initialY = mainGroup.y;

            // if the world position changes, there might be space for the tooltip
            // to be in the original position.
            _position = _origPosition;
        }

        updatePosition();

        ///////////////////////////////////////////////////////////////////////////////////



        if (_customBackground === false) {
            /// create bg
            tooltipBG = game.add.graphics(tooltipContent.width, tooltipContent.height);
            tooltipBG.beginFill(_bgColor, 1);
            tooltipBG.x = 0;
            tooltipBG.y = 0;
            tooltipBG.lineStyle(_strokeWeight, _strokeColor, 1);

            // if roundedCornersRadius option is set to 1, drawRect will be used.
            if( _roundedCornersRadius == 1 ) {
                tooltipBG.drawRect(0, 0, tooltipContent.width + _padding, tooltipContent.height + _padding, 1);
            } else {
                tooltipBG.drawRoundedRect(0, 0, tooltipContent.width + _padding, tooltipContent.height + _padding, _roundedCornersRadius);
            }
        } else {
            tooltipBG = _customBackground;
        }

        // add all to group
        mainGroup.add(tooltipBG);
        mainGroup.add(tooltipContent);
        //if(debug)
        //mainGroup.add(debug);

        // add event listener
        if(_disableInputEvents !== true) {
            _object.inputEnabled = true;
            if (_enableCursor) {
                _object.input.useHandCursor = true;
            }
            _object.events.onInputOver.add(_this.onHoverOver, this);
            _object.events.onInputDown.add(_this.onHoverOver, this);
            _object.events.onInputOut.add(_this.onHoverOut, this);
            _object.events.onInputUp.add(_this.onHoverOut, this);
        }

        mainGroup.update = function() {
            var worldPos = _options.targetObject ? _options.targetObject.world : game.world;
            if (worldPos.x !== mainGroup.initialWorldX) {
                updatePosition();
            }
        }
    };

    this.createTooltips();

    return {
        printOptions: function() {
            _this.printOptions();
        },
        updatePosition: function(x, y) {
            _this.mainGroup.x = x;
            _this.mainGroup.y = y;
        },
        destroy: function() {
            _this.mainGroup.removeChildren();
            _this.mainGroup.destroy();
        },
        hideTooltip: function() {
            _this.mainGroup.visible = false;
            _this.mainGroup.alpha = 0;
        },
        showTooltip: function() {
            _this.mainGroup.visible = true;
            _this.mainGroup.alpha = 1;
        },
        simulateOnHoverOver: function () {
            _this.onHoverOver();
        },
        simulateOnHoverOut: function () {
            _this.onHoverOut();
        }
    };
};

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Phasetips;
}

var gameModal = gameModal || {};


gameModal = function (game) {

	var _this = this;
	game.modals = {};

	/**
	 * [hideModal description]
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	this.hideModal = function (type) {
		window.console.log(type);
		game.modals[type].visible = false;
	};

	return {
		createModal: function (options) {
			var type = options.type || ''; // must be unique
			var includeBackground = options.includeBackground; // maybe not optional
			var backgroundColor = options.backgroundColor || "0x000000";
			var backgroundOpacity = options.backgroundOpacity === undefined ?
				0.7 : options.backgroundOpacity;
			var modalCloseOnInput = options.modalCloseOnInput || false;
			var modalBackgroundCallback = options.modalBackgroundCallback || false;
			var vCenter = options.vCenter || true;
			var hCenter = options.hCenter || true;
			var itemsArr = options.itemsArr || [];
			var fixedToCamera = options.fixedToCamera || false;

			var modal;
			var modalGroup = game.add.group();
			if (fixedToCamera === true) {
				modalGroup.fixedToCamera = true;
				modalGroup.cameraOffset.x = 0;
				modalGroup.cameraOffset.y = 0;
			}

			if (includeBackground === true) {
				modal = game.add.graphics(game.width, game.height);
				modal.beginFill(backgroundColor, backgroundOpacity);
				modal.x = 0;
				modal.y = 0;

				modal.drawRect(0, 0, game.width, game.height);

				if (modalCloseOnInput === true) {

					var innerModal = game.add.sprite(0, 0);
					innerModal.inputEnabled = true;
					innerModal.width = game.width;
					innerModal.height = game.height;
					innerModal.type = type;
					innerModal.input.priorityID = 0;
					innerModal.events.onInputDown.add(function (e, pointer) {
						this.hideModal(e.type);
					}, _this, 2);

					modalGroup.add(innerModal);
				} else {

					modalBackgroundCallback = true;
				}
			}

			if (modalBackgroundCallback) {
				var innerModal = game.add.sprite(0, 0);
				innerModal.inputEnabled = true;
				innerModal.width = game.width;
				innerModal.height = game.height;
				innerModal.type = type;
				innerModal.input.priorityID = 0;

				modalGroup.add(innerModal);
			}

			if (includeBackground) {
				modalGroup.add(modal);
			}

			var modalLabel;
			for (var i = 0; i < itemsArr.length; i += 1) {
				var item = itemsArr[i];
				var itemType = item.type || 'text';
				var itemColor = item.color || 0x000000;
				var itemFontfamily = item.fontFamily || 'Arial';
				var itemFontSize = item.fontSize || 32;
				var itemStroke = item.stroke || '0x000000';
				var itemStrokeThickness = item.strokeThickness || 0;
				var itemAlign = item.align || 'center';
				var offsetX = item.offsetX || 0;
				var offsetY = item.offsetY || 0;
				var contentScale = item.contentScale || 1;
				var content = item.content || "";
				var centerX = game.width / 2;
				var centerY = game.height / 2;
				var callback = item.callback || false;
				var textAlign = item.textAlign || "left";
				var atlasParent = item.atlasParent || "";
				var buttonHover = item.buttonHover || content;
				var buttonActive = item.buttonActive || content;
				var graphicColor = item.graphicColor || 0xffffff;
				var graphicOpacity = item.graphicOpacity || 1;
				var graphicW = item.graphicWidth || 200;
				var graphicH = item.graphicHeight || 200;
				var graphicRadius = item.graphicRadius || 0;
				var lockPosition = item.lockPosition || false;

				var itemAnchor = item.anchor || {x:0,y:0};
				var itemAngle = item.angle || 0;
				var itemX = item.x || 0;
				var itemY = item.y || 0;
				var imageFrame = item.frame || null;
				var tileSpriteWidth = item.tileSpriteWidth || game.width;
				var tileSpriteHeight = item.tileSpriteHeight || game.height;

				modalLabel = null;

				if (itemType === "text" || itemType === "bitmapText") {

					if (itemType === "text") {
						modalLabel = game.add.text(0, 0, content, {
							font: itemFontSize + 'px ' + itemFontfamily,
							fill: "#" + String(itemColor).replace("0x", ""),
							stroke: "#" + String(itemStroke).replace("0x", ""),
							strokeThickness: itemStrokeThickness,
							align: itemAlign
						});
						modalLabel.contentType = 'text';
						modalLabel.update();
						modalLabel.x = ((game.width / 2) - (modalLabel.width / 2)) + offsetX;
						modalLabel.y = ((game.height / 2) - (modalLabel.height / 2)) + offsetY;
					} else {
						modalLabel = game.add.bitmapText(0, 0, itemFontfamily, String(content), itemFontSize);
						modalLabel.contentType = 'bitmapText';
						modalLabel.align = textAlign;
						modalLabel.updateText();
						modalLabel.x = (centerX - (modalLabel.width / 2)) + offsetX;
						modalLabel.y = (centerY - (modalLabel.height / 2)) + offsetY;
					}

				} else if (itemType === "image") {
					modalLabel = game.add.image(0, 0, content);
					modalLabel.scale.setTo(contentScale, contentScale);
					modalLabel.contentType = 'image';
					modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
					modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
				} else if (itemType === "tileSprite") {
					modalLabel = game.add.tileSprite(itemX, itemY,
						tileSpriteWidth, tileSpriteHeight, content, imageFrame);
					modalLabel.scale.setTo(contentScale, contentScale);
					modalLabel.anchor.setTo(itemAnchor.x, itemAnchor.y);
					modalLabel.angle = itemAngle;
					modalLabel.contentType = 'tileSprite';
				} else if (itemType === "sprite") {
					modalLabel = game.add.sprite(0, 0, atlasParent, content);
					modalLabel.scale.setTo(contentScale, contentScale);
					modalLabel.contentType = 'sprite';
					modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
					modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
				} else if (itemType === "button") {
					modalLabel = game.add.button(0, 0, atlasParent, callback,
						this, buttonHover, content, buttonActive, content);
					modalLabel.scale.setTo(contentScale, contentScale);
					modalLabel.contentType = 'button';
					modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
					modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;

				} else if (itemType === "graphics") {
					modalLabel = game.add.graphics(graphicW, graphicH);
					modalLabel.beginFill(graphicColor, graphicOpacity);
					if (graphicRadius <= 0) {
						modalLabel.drawRect(0, 0, graphicW, graphicH);
					} else {
						modalLabel.drawRoundedRect(0, 0, graphicW, graphicH, graphicRadius);
					}
					modalLabel.endFill();
					modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
					modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
				}

				modalLabel["_offsetX"] = 0;
				modalLabel["_offsetY"] = 0;
				modalLabel["lockPosition"] = lockPosition;
				modalLabel._offsetX = offsetX;
				modalLabel._offsetY = offsetY;


				if (callback !== false && itemType !== "button") {
					modalLabel.inputEnabled = true;
					modalLabel.pixelPerfectClick = true;
					modalLabel.priorityID = 10;
					modalLabel.events.onInputDown.add(callback, modalLabel);
				}

				if (itemType !== "bitmapText" && itemType !== "graphics") {
					modalLabel.bringToTop();
					modalGroup.add(modalLabel);
					modalLabel.bringToTop();
					modalGroup.bringToTop(modalLabel);
				} else {
					modalGroup.add(modalLabel);
					modalGroup.bringToTop(modalLabel);
				}
			}

			modalGroup.visible = false;
			game.modals[type] = modalGroup;

		},
		updateModalValue: function (value, type, index, id) {
			var item;
			if (index !== undefined && index !== null) {
				item = game.modals[type].getChildAt(index);
			} else if (id !== undefined && id !== null) {

			}

			if (item.contentType === "text") {
				item.text = value;
				item.update();
				if (item.lockPosition === true) {

				} else {
					item.x = ((game.width / 2) - (item.width / 2)) + item._offsetX;
					item.y = ((game.height / 2) - (item.height / 2)) + item._offsetY;
				}
			} else if (item.contentType === "bitmapText") {
				item.text = value;
				item.updateText();
				if (item.lockPosition === true) {

				} else {
					item.x = ((game.width / 2) - (item.width / 2)) + item._offsetX;
					item.y = ((game.height / 2) - (item.height / 2)) + item._offsetY;
				}
			} else if (item.contentType === "image") {
				item.loadTexture(value);
			}

		},
		getModalItem: function (type, index) {
			return game.modals[type].getChildAt(index);
		},
		showModal: function (type) {
			game.world.bringToTop(game.modals[type]);
			game.modals[type].visible = true;
			// you can add animation here
		},
		hideModal: function (type) {
			game.modals[type].visible = false;
			// you can add animation here
		},
		destroyModal: function (type) {
			game.modals[type].destroy();
			delete game.modals[type];
		}
	};
};
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-audio-touch
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:v(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},p.cssanimations=function(){return E("animationName")},p.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e}(this,this.document);
/*!
 * phaser-ads - version 2.0.3
 * A Phaser plugin for providing nice ads integration in your phaser.io game
 *
 * OrangeGames
 * Build at 27-01-2017
 * Released under MIT License
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhaserAds;
(function (PhaserAds) {
    var AdEvent;
    (function (AdEvent) {
        AdEvent[AdEvent["start"] = 0] = "start";
        AdEvent[AdEvent["firstQuartile"] = 1] = "firstQuartile";
        AdEvent[AdEvent["midPoint"] = 2] = "midPoint";
        AdEvent[AdEvent["thirdQuartile"] = 3] = "thirdQuartile";
        AdEvent[AdEvent["complete"] = 4] = "complete";
    })(AdEvent = PhaserAds.AdEvent || (PhaserAds.AdEvent = {}));
    var AdManager = (function (_super) {
        __extends(AdManager, _super);
        function AdManager(game, pluginManager) {
            var _this = _super.call(this, game, pluginManager) || this;
            _this.onContentPaused = new Phaser.Signal();
            _this.onContentResumed = new Phaser.Signal();
            _this.onAdProgression = new Phaser.Signal();
            _this.onAdsDisabled = new Phaser.Signal();
            _this.onAdClicked = new Phaser.Signal();
            _this.onAdRewardGranted = new Phaser.Signal();
            _this.provider = null;
            _this.wasMuted = false;
            Object.defineProperty(game, 'ads', {
                value: _this
            });
            return _this;
        }
        /**
         * Here we set an adprovider, any can be given as long as it implements the IProvider interface
         *
         * @param provider
         */
        AdManager.prototype.setAdProvider = function (provider) {
            this.provider = provider;
            this.provider.setManager(this);
        };
        /**
         * Here we request an ad, the arguments passed depend on the provider used!
         * @param args
         */
        AdManager.prototype.showAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not request an ad without an provider, please attach an ad provider!');
            }
            //Let's not do this for banner's
            if (args[0] && args[0] !== PhaserAds.AdProvider.CocoonAdType.banner) {
                //first we check if the sound was already muted before we requested an add
                this.wasMuted = this.game.sound.mute;
                //Let's mute audio for the game, we can resume the audi playback once the add has played
                this.game.sound.mute = true;
            }
            this.provider.showAd.apply(this.provider, args);
        };
        /**
         * Some providers might require you to preload an ad before showing it, that can be done here
         *
         * @param args
         */
        AdManager.prototype.preloadAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not preload an ad without an provider, please attach an ad provider!');
            }
            this.provider.preloadAd.apply(this.provider, args);
        };
        /**
         * Some providers require you to destroy an add after it was shown, that can be done here.
         *
         * @param args
         */
        AdManager.prototype.destroyAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not destroy an ad without an provider, please attach an ad provider!');
            }
            this.provider.destroyAd.apply(this.provider, args);
        };
        /**
         * Some providers allow you to hide an ad, you might think of an banner ad that is shown in show cases
         *
         * @param args
         */
        AdManager.prototype.hideAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not hide an ad without an provider, please attach an ad provider!');
            }
            this.unMuteAfterAd();
            this.provider.hideAd.apply(this.provider, args);
        };
        /**
         * Checks if ads are enabled or blocked
         *
         * @param args
         */
        AdManager.prototype.adsEnabled = function () {
            return this.provider.adsEnabled;
        };
        /**
         * Should be called after ad was(n't) shown, demutes the game so we can peacefully continue
         */
        AdManager.prototype.unMuteAfterAd = function () {
            if (!this.wasMuted) {
                //Here we unmute audio, but only if it wasn't muted before requesting an add
                this.game.sound.mute = false;
            }
        };
        return AdManager;
    }(Phaser.Plugin));
    PhaserAds.AdManager = AdManager;
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var CocoonProvider;
        (function (CocoonProvider) {
            CocoonProvider[CocoonProvider["AdMob"] = 0] = "AdMob";
            CocoonProvider[CocoonProvider["MoPub"] = 1] = "MoPub";
            CocoonProvider[CocoonProvider["Chartboost"] = 2] = "Chartboost";
            CocoonProvider[CocoonProvider["Heyzap"] = 3] = "Heyzap";
        })(CocoonProvider = AdProvider.CocoonProvider || (AdProvider.CocoonProvider = {}));
        var CocoonAdType;
        (function (CocoonAdType) {
            CocoonAdType[CocoonAdType["banner"] = 0] = "banner";
            CocoonAdType[CocoonAdType["interstitial"] = 1] = "interstitial";
            CocoonAdType[CocoonAdType["insentive"] = 2] = "insentive";
        })(CocoonAdType = AdProvider.CocoonAdType || (AdProvider.CocoonAdType = {}));
        var CocoonAds = (function () {
            function CocoonAds(game, provider, config) {
                this.adsEnabled = false;
                this.banner = null;
                this.bannerShowable = false;
                this.interstitial = null;
                this.interstitialShowable = false;
                this.insentive = null;
                this.insentiveShowable = false;
                if ((game.device.cordova || game.device.crosswalk) && (Cocoon && Cocoon.Ad)) {
                    this.adsEnabled = true;
                }
                else {
                    return;
                }
                switch (provider) {
                    default:
                    case CocoonProvider.AdMob:
                        this.cocoonProvider = Cocoon.Ad.AdMob;
                        break;
                    case CocoonProvider.Chartboost:
                        this.cocoonProvider = Cocoon.Ad.Chartboost;
                        break;
                    case CocoonProvider.Heyzap:
                        this.cocoonProvider = Cocoon.Ad.Heyzap;
                        break;
                    case CocoonProvider.MoPub:
                        this.cocoonProvider = Cocoon.Ad.MoPub;
                        break;
                }
                this.cocoonProvider.configure(config);
            }
            CocoonAds.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            CocoonAds.prototype.showAd = function (adType) {
                if (!this.adsEnabled) {
                    this.adManager.unMuteAfterAd();
                    if (!(adType === CocoonAdType.banner)) {
                        this.adManager.onContentResumed.dispatch();
                    }
                    return;
                }
                if (adType === CocoonAdType.banner) {
                    if (!this.bannerShowable || null === this.banner) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        //this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                        return;
                    }
                    this.banner.show();
                }
                if (adType === CocoonAdType.interstitial) {
                    if (!this.interstitialShowable || null === this.interstitial) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
                        return;
                    }
                    this.interstitial.show();
                }
                if (adType === CocoonAdType.insentive) {
                    if (!this.insentiveShowable || null === this.insentive) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
                        return;
                    }
                    this.insentive.show();
                }
            };
            CocoonAds.prototype.preloadAd = function (adType, adId, bannerPosition) {
                var _this = this;
                if (!this.adsEnabled) {
                    return;
                }
                //Some cleanup before preloading a new ad
                this.destroyAd(adType);
                if (adType === CocoonAdType.banner) {
                    this.banner = this.cocoonProvider.createBanner(adId);
                    if (bannerPosition) {
                        this.banner.setLayout(bannerPosition);
                    }
                    this.banner.on('load', function () {
                        _this.bannerShowable = true;
                    });
                    this.banner.on('fail', function () {
                        _this.bannerShowable = false;
                        _this.banner = null;
                    });
                    this.banner.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.banner);
                    });
                    //Banner don't pause or resume content
                    this.banner.on('show', function () {
                        // this.adManager.onContentPaused.dispatch(CocoonAdType.banner);
                    });
                    this.banner.on('dismiss', function () {
                        // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                        // this.bannerShowable = false;
                        // this.banner = null;
                    });
                    this.banner.load();
                }
                if (adType === CocoonAdType.interstitial) {
                    this.interstitial = this.cocoonProvider.createInterstitial(adId);
                    this.interstitial.on('load', function () {
                        _this.interstitialShowable = true;
                    });
                    this.interstitial.on('fail', function () {
                        _this.interstitialShowable = false;
                        _this.interstitial = null;
                    });
                    this.interstitial.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.interstitial);
                    });
                    this.interstitial.on('show', function () {
                        _this.adManager.onContentPaused.dispatch(CocoonAdType.interstitial);
                    });
                    this.interstitial.on('dismiss', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
                        _this.interstitialShowable = false;
                        _this.interstitial = null;
                    });
                    this.interstitial.load();
                }
                if (adType === CocoonAdType.insentive) {
                    this.insentive = this.cocoonProvider.createRewardedVideo(adId);
                    this.insentive.on('load', function () {
                        _this.insentiveShowable = true;
                    });
                    this.insentive.on('fail', function () {
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.insentive);
                    });
                    this.insentive.on('show', function () {
                        _this.adManager.onContentPaused.dispatch(CocoonAdType.insentive);
                    });
                    this.insentive.on('dismiss', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.on('reward', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onAdRewardGranted.dispatch(CocoonAdType.insentive);
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.load();
                }
            };
            CocoonAds.prototype.destroyAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === CocoonAdType.banner && null !== this.banner) {
                    this.cocoonProvider.releaseBanner(this.banner);
                    this.banner = null;
                    this.bannerShowable = false;
                }
                if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                    this.cocoonProvider.releaseInterstitial(this.interstitial);
                    this.interstitial = null;
                    this.interstitialShowable = false;
                }
            };
            CocoonAds.prototype.hideAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                    this.interstitial.hide();
                }
                if (adType === CocoonAdType.banner && null !== this.banner) {
                    this.banner.hide();
                }
                if (adType === CocoonAdType.insentive && null !== this.insentive) {
                    this.insentive.hide();
                }
            };
            return CocoonAds;
        }());
        AdProvider.CocoonAds = CocoonAds;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var HeyzapAdTypes;
        (function (HeyzapAdTypes) {
            HeyzapAdTypes[HeyzapAdTypes["Interstitial"] = 0] = "Interstitial";
            HeyzapAdTypes[HeyzapAdTypes["Video"] = 1] = "Video";
            HeyzapAdTypes[HeyzapAdTypes["Rewarded"] = 2] = "Rewarded";
            HeyzapAdTypes[HeyzapAdTypes["Banner"] = 3] = "Banner";
        })(HeyzapAdTypes = AdProvider.HeyzapAdTypes || (AdProvider.HeyzapAdTypes = {}));
        var CordovaHeyzap = (function () {
            function CordovaHeyzap(game, publisherId) {
                var _this = this;
                this.adsEnabled = false;
                if (game.device.cordova || game.device.crosswalk) {
                    this.adsEnabled = true;
                }
                else {
                    return;
                }
                HeyzapAds.start(publisherId).then(function () {
                    // Native call successful.
                }, function (error) {
                    //Failed to start heyzap, disabling ads
                    _this.adsEnabled = false;
                });
            }
            CordovaHeyzap.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            CordovaHeyzap.prototype.showAd = function (adType, bannerAdPositions) {
                var _this = this;
                if (!this.adsEnabled) {
                    this.adManager.unMuteAfterAd();
                    this.adManager.onContentResumed.dispatch();
                }
                switch (adType) {
                    case HeyzapAdTypes.Interstitial:
                        //Register event listeners
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.InterstitialAd.Events.HIDE);
                        });
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.InterstitialAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.InterstitialAd.Events.CLICKED);
                        });
                        HeyzapAds.InterstitialAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Video:
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.VideoAd.Events.HIDE);
                        });
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.VideoAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.VideoAd.Events.CLICKED);
                        });
                        HeyzapAds.VideoAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Rewarded:
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.IncentivizedAd.Events.HIDE);
                        });
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.IncentivizedAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.IncentivizedAd.Events.CLICKED);
                        });
                        HeyzapAds.IncentivizedAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Banner:
                        HeyzapAds.BannerAd.show(bannerAdPositions).then(function () {
                            // Native call successful.
                        }, function (error) {
                            // Handle Error
                        });
                        break;
                }
            };
            CordovaHeyzap.prototype.preloadAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Rewarded) {
                    HeyzapAds.IncentivizedAd.fetch().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            CordovaHeyzap.prototype.destroyAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Banner) {
                    HeyzapAds.BannerAd.destroy().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            CordovaHeyzap.prototype.hideAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Banner) {
                    HeyzapAds.BannerAd.hide().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            return CordovaHeyzap;
        }());
        AdProvider.CordovaHeyzap = CordovaHeyzap;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var Ima3 = (function () {
            function Ima3(game, adTagUrl) {
                this.adsManager = null;
                this.googleEnabled = false;
                this.adsEnabled = true;
                this.adTagUrl = '';
                this.adRequested = false;
                this.adManager = null;
                this.resizeListener = null;
                this.adsEnabled = this.areAdsEnabled();
                if (typeof google === 'undefined') {
                    return;
                }
                this.googleEnabled = true;
                this.gameContent = (typeof game.parent === 'string') ? document.getElementById(game.parent) : game.parent;
                // this.gameContent.currentTime = 100;
                this.gameContent.style.position = 'absolute';
                this.gameContent.style.width = '100%';
                this.adContent = this.gameContent.parentNode.appendChild(document.createElement('div'));
                this.adContent.id = 'phaser-ad-container';
                this.adContent.style.position = 'absolute';
                this.adContent.style.zIndex = '9999';
                this.adContent.style.display = 'none';
                this.adContent.style.top = '0';
                this.adContent.style.left = '0';
                this.adContent.style.width = '100%';
                this.adContent.style.height = '100%';
                this.adContent.style.overflow = 'hidden';
                this.adTagUrl = adTagUrl;
                this.game = game;
                // Create the ad display container.
                this.adDisplay = new google.ima.AdDisplayContainer(this.adContent);
                //Set vpaid enabled, and update locale
                google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
                google.ima.settings.setLocale('nl');
                // Create ads loader, and register events
                this.adLoader = new google.ima.AdsLoader(this.adDisplay);
                this.adLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdManagerLoader, false, this);
                this.adLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
            }
            Ima3.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            /**
             * Doing an ad request, if anything is wrong with the lib (missing ima3, failed request) we just dispatch the contentResumed event
             * Otherwise we display an ad
             */
            Ima3.prototype.showAd = function (customParams) {
                // console.log('Ad Requested');
                if (this.adRequested) {
                    return;
                }
                if (!this.adsEnabled) {
                    this.adManager.onAdsDisabled.dispatch(true);
                }
                if (!this.googleEnabled) {
                    this.onContentResumeRequested();
                    return;
                }
                //For mobile this ad request needs to be handled post user click
                this.adDisplay.initialize();
                // Request video ads.
                var adsRequest = new google.ima.AdsRequest();
                adsRequest.adTagUrl = this.adTagUrl + this.parseCustomParams(customParams);
                var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
                var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
                //Here we check if phaser is fullscreen or not, if we are fullscreen, we subtract some of the width and height, to counter for the resize (
                //Fullscreen should be disabled for the ad, (onContentPaused) and requested for again when the game resumes
                if (this.game.scale.isFullScreen && document.body.clientHeight < window.innerHeight) {
                    height = document.body.clientHeight;
                    width = document.body.clientWidth;
                }
                // Specify the linear and nonlinear slot sizes. This helps the SDK to
                // select the correct creative if multiple are returned.
                adsRequest.linearAdSlotWidth = width;
                adsRequest.linearAdSlotHeight = height;
                adsRequest.nonLinearAdSlotWidth = width;
                adsRequest.nonLinearAdSlotHeight = height;
                //Required for games, see:
                //http://googleadsdeveloper.blogspot.nl/2015/10/important-changes-for-gaming-publishers.html
                adsRequest.forceNonLinearFullSlot = true;
                try {
                    this.adRequested = true;
                    this.adLoader.requestAds(adsRequest);
                }
                catch (e) {
                    // console.log(e);
                    this.onContentResumeRequested();
                }
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.preloadAd = function () {
                return;
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.destroyAd = function () {
                return;
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.hideAd = function () {
                return;
            };
            /**
             * Called when the ads manager was loaded.
             * We register all ad related events here, and initialize the manager with the game width/height
             *
             * @param adsManagerLoadedEvent
             */
            Ima3.prototype.onAdManagerLoader = function (adsManagerLoadedEvent) {
                var _this = this;
                // console.log('AdsManager loaded');
                // Get the ads manager.
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
                // videoContent should be set to the content video element.
                var adsManager = adsManagerLoadedEvent.getAdsManager(this.gameContent, adsRenderingSettings);
                this.adsManager = adsManager;
                // console.log(adsManager.isCustomClickTrackingUsed());
                // Add listeners to the required events.
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested, false, this);
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
                [
                    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.LOADED,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE
                ].forEach(function (event) {
                    adsManager.addEventListener(event, _this.onAdEvent, false, _this);
                });
                try {
                    //Show the ad elements, we only need to show the faux videoelement on iOS, because the ad is displayed in there.
                    this.adContent.style.display = 'block';
                    // Initialize the ads manager. Ad rules playlist will start at this time.
                    var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
                    var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
                    this.adsManager.init(width, height, google.ima.ViewMode.NORMAL);
                    // Call play to start showing the ad. Single video and overlay ads will
                    // start at this time; the call will be ignored for ad rules.
                    this.adsManager.start();
                    this.resizeListener = function () {
                        //Window was resized, so expect something similar
                        // console.log('Resizing ad size');
                        _this.adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.NORMAL);
                    };
                    window.addEventListener('resize', this.resizeListener);
                }
                catch (adError) {
                    console.log('Adsmanager error:', adError);
                    this.onAdError(adError);
                }
            };
            /**
             * Generic ad events are handled here
             * @param adEvent
             */
            Ima3.prototype.onAdEvent = function (adEvent) {
                // console.log('onAdEvent', adEvent);
                switch (adEvent.type) {
                    case google.ima.AdEvent.Type.CLICK:
                        this.adManager.onAdClicked.dispatch();
                        break;
                    case google.ima.AdEvent.Type.LOADED:
                        this.adRequested = false;
                        var ad = adEvent.getAd();
                        // console.log('is ad linear?', ad.isLinear());
                        if (!ad.isLinear()) {
                            this.onContentResumeRequested();
                        }
                        break;
                    case google.ima.AdEvent.Type.STARTED:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.start);
                        break;
                    case google.ima.AdEvent.Type.FIRST_QUARTILE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.firstQuartile);
                        break;
                    case google.ima.AdEvent.Type.MIDPOINT:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.midPoint);
                        break;
                    case google.ima.AdEvent.Type.THIRD_QUARTILE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.thirdQuartile);
                        break;
                    case google.ima.AdEvent.Type.COMPLETE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.complete);
                        break;
                    case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                        this.onContentResumeRequested();
                        break;
                }
            };
            Ima3.prototype.onAdError = function (error) {
                // console.log('gneric ad error', error);
                if (null !== this.adsManager) {
                    this.adsManager.destroy();
                    this.adsManager = null;
                    if (null !== this.resizeListener) {
                        window.removeEventListener('resize', this.resizeListener);
                        this.resizeListener = null;
                    }
                }
                if (this.adRequested) {
                    this.adRequested = false;
                }
                //We silently ignore adLoader errors, it just means there is no ad available
                this.onContentResumeRequested(error);
            };
            /**
             * When the ad starts playing, and the game should be paused
             */
            Ima3.prototype.onContentPauseRequested = function () {
                // console.log('onContentPauseRequested', arguments);
                this.adManager.onContentPaused.dispatch();
            };
            /**
             * When the ad is finished and the game should be resumed
             */
            Ima3.prototype.onContentResumeRequested = function (arguments) {
                var _returnValue = true;
                if(arguments.type) _returnValue = arguments.type;
                // console.log('onContentResumeRequested', arguments);
                if (typeof google === 'undefined') {
                    this.adManager.unMuteAfterAd();
                    this.adManager.onContentResumed.dispatch(_returnValue);
                    return;
                }
                this.adContent.style.display = 'none';
                this.adManager.unMuteAfterAd();
                this.adManager.onContentResumed.dispatch(_returnValue);
            };
            Ima3.prototype.parseCustomParams = function (customParams) {
                if (undefined !== customParams) {
                    var customDataString = '';
                    for (var key in customParams) {
                        if (customParams.hasOwnProperty(key)) {
                            if (customDataString.length > 0) {
                                customDataString += '' +
                                    '&';
                            }
                            var param = (Array.isArray(customParams[key])) ? customParams[key].join(',') : customParams[key];
                            customDataString += key + '=' + param;
                        }
                    }
                    return '&cust_params=' + encodeURIComponent(customDataString);
                }
                return '';
            };
            /**
             * Checks id the ads are enabled
             * @returns {boolean}
             */
            Ima3.prototype.areAdsEnabled = function () {
                var test = document.createElement('div');
                test.innerHTML = '&nbsp;';
                test.className = 'adsbox';
                document.body.appendChild(test);
                var adsEnabled;
                var isEnabled = function () {
                    var enabled = true;
                    if (test.offsetHeight === 0) {
                        enabled = false;
                    }
                    test.parentNode.removeChild(test);
                    return enabled;
                };
                window.setTimeout(adsEnabled = isEnabled(), 100);
                return adsEnabled;
            };
            return Ima3;
        }());
        AdProvider.Ima3 = Ima3;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
