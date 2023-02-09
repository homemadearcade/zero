/**
 * @author alexwebgr < https://github.com/alexwebgr >
 * @desc the word 'Session' is used as a convention in order to avoid overriding
 * the Storage or localStorage objects since localStorage is persisted in the browser
 * even if the browser window closes or even the system restarts
 * the only way to delete localStorage is manually
 */

window.LocalStorageSession =
{
    //save an item to localStorage
    setItem : function (key, value)
    {
        return localStorage.setItem(key, JSON.stringify(value));
    },

    //retrieve an item from localStorage
    getItem : function (key)
    {
        if(localStorage.getItem(key) === undefined)
            return {};

        return JSON.parse(localStorage.getItem(key));
    },

    //remove one item from localStorage
    removeItem : function (key)
    {
        return window.LocalStorageSession.setItem(key, {});
    },

    //remove all items from localStorage
    clear : function()
    {
        localStorage.clear();
    }
};

/**
 * @usage use like an normal literal js object
 * when ready to save, it will get stringified and stored back in localStorage under the key name
 * that enables the storage of multiple keys that hold whole arrays and objects
 * not just strings or numbers
 */

/*
 var session = Session.getItem("session");
 session.key1 = "value1";
 session.key2 = "value2";
 
 session.key3 = {
    key1 : "value1"
 };
 
 session.key4 =
 [
     {
         key1 : "value1",
         key2 : "Value2"
     },
     {
         key1 : "value1",
         key2 : "Value2"
     }
 ]
 ;
 Session.setItem("session", session);
 */


