import * as Plugin from "iitcpluginkit";
import image from "./copy.svg";


interface Android {
    copy(text: string): void;
}
declare let android: Android;


class CopyGPS implements Plugin.Class {

    init() {
        console.log("CopyGPS " + VERSION);

        require("./styles.css");

        window.addHook('portalDetailsUpdated', () => this.addToPortalDetails());
    }

    addToPortalDetails(): void {

        if (window.selectedPortal == null) {
            return;
        }

        $("#portaldetails").append(
            $("<img>", { src: image, class: "copygpsbtn" }).click(() => this.copyGPS())
        );
    }

    copyGPS(): void {

        if (!window.selectedPortal) return;

        const portal = window.portals[window.selectedPortal];
        if (!portal) return;

        this.copyToClipboard(`${portal.getLatLng().lat},${portal.getLatLng().lng}`);
    }


    copyToClipboard(text: string): void {
        if (typeof android !== "undefined" && !!android) {
            android.copy(text);
            return;
        }

        const element = document.createElement("textarea");
        element.value = text;
        element.setAttribute("readonly", "");
        element.style.position = "absolute";
        element.style.left = "-9999px";
        document.body.appendChild(element);
        element.select();
        document.execCommand("copy");
        document.body.removeChild(element);

        this.toastMessage("copied to clipboard");
    }


    toastMessage(text: string, duration: number = 1500): void {
        const margin = 100;

        const message = $("<div>", { class: "toast-popup", text });
        $("body").append(message);

        message.css("width", "auto");
        const windowWidth = window.innerWidth;
        let toastWidth = message.innerWidth()! + margin;
        if (toastWidth >= windowWidth) {
            toastWidth = windowWidth - margin;
            $(self).css("width", toastWidth);
        }
        else {
            toastWidth = message.innerWidth()!;
        }

        const left = (windowWidth - toastWidth) / 2;
        const leftInPercentage = left * 100 / windowWidth;
        message.css("left", `${leftInPercentage}%`);
        message.fadeIn(400);

        setTimeout(() => {
            message.fadeOut(600);
            setTimeout(() => message.remove(), 600);
        }, duration);
    }
}


Plugin.Register(new CopyGPS(), "CopyGPS");
