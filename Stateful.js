define([
	"dojo/_base/declare",
	"dojo/Stateful"
], function(declare, Stateful){
	return declare("dojox.mvc.Stateful", Stateful, {
		// summary:
		//		dojo.Stateful extension, supporting pre-defined getters/setters.
		// description:
		//		dojo.Stateful extension.
		//		getXXXAttr()/setXXXAttr() functions are used for getter/setter if those corresponding to name are defined.

		get: function(/*String*/ name){
			// summary:
			//		Returns a property in this object.
			// description:
			//		Returns a property in this object. If getXXXAttr() function corresponding to name is defined, uses it. 
			// name: String
			//		The property name.

			var getterName = "_get" + name.replace(/^[a-z]/, function(c){ return c.toUpperCase(); }) + "Attr";
			// If there is dijit._WidgetBase in upper class hierarchy (happens when this descendant is mixed into a widget), let _WidgetBase do all work
			if(!this._applyAttributes && this[getterName]){
				return this[name] = this[getterName]();
			}
			return this.inherited(arguments);
		},

		set: function(/*String*/ name, /*Anything*/ value){
			// summary:
			//		Set a property to this.
			// description:
			//		Sets a property to this. If setXXXAttr() function corresponding to name is defined, uses it. 
			// name: String
			//		The property to set.
			// value: Anything
			//		The value to set in the property.

			// If an object is used, iterate through object
			if(typeof name === "object"){
				for(var x in name){
					if(name.hasOwnProperty(x)){
						this.set(x, name[x]);
					}
				}
				return this;
			}

			// If there is dijit._WidgetBase in upper class hierarchy (happens when this descendant is mixed into a widget), let _WidgetBase do all work
			if(this._applyAttributes){
				return this.inherited(arguments);
			}
			var setterName = "_set" + name.replace(/^[a-z]/, function(c){ return c.toUpperCase(); }) + "Attr";
			if(this[setterName]){
				this[setterName](value);
			}else{
				this._set(name, value);
			}
			return this;
		},

		_set: function(/*String*/ name, /*Anything*/ value){
			// summary:
			//		Internal method to set a property to this.
			// description:
			//		Sets a property to this, and the call stateful watch callback.
			// name: String
			//		The property to set.
			// value: Anything
			//		The value to set in the property.

			// If there is dijit._WidgetBase in upper class hierarchy (happens when this descendant is mixed into a widget), let _WidgetBase do all work
			if(this._applyAttributes){
				return this.inherited(arguments);
			}
			var oldValue = this[name];
			this[name] = value;
			if(this._watchCallbacks && value !== oldValue){
				this._watchCallbacks(name, oldValue, value);
			}
			return this;
		}
	});
});
