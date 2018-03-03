package com.dadabook;

import com.facebook.react.ReactActivity;
import android.view.KeyEvent;
import com.github.kevinejohn.keyevent.KeyEventModule; 

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "dadaBook";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        KeyEventModule.getInstance().onKeyDownEvent(keyCode,event);
        super.onKeyDown(keyCode, event);
        return true;
    }

}
