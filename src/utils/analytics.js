import { analytics, logEvent } from "../firebase";

export const trackPlaceOpened = (place) => {
    logEvent(analytics, "place_opened", {
        place_id: place.id,
        place_name: place.title,
        category: place.tags?.[0] ?? "none",
    });
};

export const trackViewChange = (view) => {
    logEvent(analytics, "view_change", { view });
};

export const trackCategoryFilter = (categoryId) => {
    logEvent(analytics, "category_filter", {
        category: categoryId ?? "all",
    });
};

export const trackInstagramClick = () => {
    logEvent(analytics, "instagram_click");
};
