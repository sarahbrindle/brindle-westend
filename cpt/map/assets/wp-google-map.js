var map = {
    dom: function () {
        (this.$map = $("#map")),
            (this.$stickyHeader = $("#sticky-header")),
            (this.$mapCanvas = $("#map_canvas")),
            (this.$map = $("#map")),
            (this.$mapBody = $("#map-body")),
            (this.$zoomIn = $("#zoom_in")),
            (this.$zoomOut = $("#zoom_out")),
            (this.$refresh = $("#refresh")),
            (this.$poiFilter = $('[data-js-hook="poi-filter"]')),
            (this.$mainInfoBoxTemplate = $("#main-infobox-template")),
            (this.$infoBoxTemplate = $("#infobox-template")),
            (this.$poiToggleBox = $('[data-js-hook="toggle-poi-infobox"]')),
            (this.$poiCategory = $('[data-js-hook="poi-category"]')),
            (this.$stickyHeader = $("#sticky-header")),
            (this.$mapBodyWrap = $("#neighborhood-map-body"));
    },
    definitions: function () {
        this.instance,
            this.mainInfoBox,
            (this.poiMarkers = []),
            (this.assetPath = config.siteUrl + mapSettings.assetPath.replace(/^\/|\/$/g, "") + "/"),
            (this.icons = {}),
            (this.categoryChanged = !1),
            (this.zoomIncrement = 1),
            (this.defaultCategory = mapSettings.defaultCategory),
            (this.currentCategory = null),
            (this.homeImageFile = "map_home.png"),
            (this.dataEndpoint = "neighborhood"),
            (this.poiIconFormat = "{{category}}_small"),
            (this.mainInfoboxHTML = this.$mainInfoBoxTemplate.html()),
            (this.poiInfoboxHTML = this.$infoBoxTemplate.html()),
            (this.mapStyles = mapSettings.style
                ? mapSettings.style
                : [
                      { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#a5a19e" }] },
                      { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },
                      { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f2f0f0" }] },
                      { featureType: "landscape.man_made", elementType: "labels", stylers: [{ visibility: "off" }] },
                      { featureType: "landscape.natural.landcover", elementType: "geometry", stylers: [{ visibility: "off" }] },
                      { featureType: "landscape.natural.terrain", elementType: "geometry.fill", stylers: [{ color: "#000000" }, { lightness: "87" }] },
                      { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
                      { featureType: "poi.park", elementType: "all", stylers: [{ visibility: "on" }] },
                      { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#bcd1bb" }] },
                      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#afaba8" }] },
                      { featureType: "road", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
                      { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#dfdcdb" }] },
                      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#c2bebc" }] },
                      { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#787471" }] },
                      { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#dfdcdb" }] },
                      { featureType: "road.arterial", elementType: "geometry.stroke", stylers: [{ color: "#cccccc" }] },
                      { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#dfdcdb" }] },
                      { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                      { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#bbcad2" }] },
                  ]);
    },
    onGoogleLoad: function (e) {
        e();
    },
    loadMap: function (e, t) {
        map.setOptions(),
            (map.googleMap = google.maps),
            (map.instance = new map.googleMap.Map(map.$mapCanvas[0], map.mapOptions)),
            map.bindControls(),
            map.googleMap.event.addDomListener(window, "resize", map.mapResize),
            map.currentCategory || mapSettings.loadAll || (map.currentCategory = map.defaultCategory);
        var i = new map.googleMap.Marker({
            map: map.instance,
            position: map.latlng,
            icon: {
                path: map.googleMap.SymbolPath.CIRCLE,
                fillColor: "#" + mapSettings.homeMarker.color,
                fillOpacity: 1,
                strokeColor: "#" + mapSettings.homeMarker.color,
                strokeOpacity: 1,
                strokeWeight: 0,
                scale: { small: 6, medium: 9, large: 14 }[mapSettings.homeMarker.size],
            },
        });
        ((map.mainInfoBox = $.extend(new InfoBox(map.pinpointOptions), { isMain: !0 })),
        map.openMarker(map.mainInfoBox, i),
        map.bindMarkerOpen(map.mainInfoBox, i),
        mapSettings.pois.forEach(function (e) {
            map.drawPoint(e);
        }),
        !t && map.loadAll ? (map.currentCategory = null) : map.currentCategory || (t = !1),
        map.poiVisibility(map.currentCategory, !(!e || "resize" != e.type), !t),
        google.maps.event.addListenerOnce(map.instance, "idle", function () {
            $("img", self.$mapCanvas).each(function (e) {
                $(this).attr("alt") || $(this).attr("alt", "Google Maps Icon " + e);
            }),
                $("iframe", self.$mapCanvas).attr("title", "Google Maps iframe");
        }),
        mapSettings.areaHighlight.coordinates.length && mapSettings.areaHighlight.color) &&
            new google.maps.Polygon({
                paths: mapSettings.areaHighlight.coordinates,
                strokeColor: "#" + mapSettings.areaHighlight.color,
                strokeOpacity: mapSettings.areaHighlight.opacity + 0.2 * mapSettings.areaHighlight.opacity,
                strokeWeight: 2,
                fillColor: "#" + mapSettings.areaHighlight.color,
                fillOpacity: mapSettings.areaHighlight.opacity,
            }).setMap(map.instance);
    },
    offsetCenter: function (e, t, i) {
        var n = Math.pow(2, map.instance.getZoom()),
            o = map.instance.getProjection().fromLatLngToPoint(e),
            a = new map.googleMap.Point(t / n || 0, i / n || 0),
            s = new map.googleMap.Point(o.x - a.x, o.y + a.y),
            r = map.instance.getProjection().fromPointToLatLng(s);
        map.instance.panTo(r);
    },
    mapResize: function () {
        var t = new map.googleMap.LatLngBounds();
        map.poiMarkers.forEach(function (e) {
            (e.category != map.currentCategory && map.currentCategory) || t.extend(e.position);
        }),
            310 <= $(window).width()
                ? (map.instance.fitBounds(t), map.instance.setZoom(map.instance.getZoom()))
                : $(window).width() < 310 &&
                  setTimeout(function () {
                      var e = new map.googleMap.LatLngBounds().extend(map.latlng);
                      map.instance.fitBounds(e), map.instance.setZoom(4 == neighborhoodSettings.layout ? map.instance.getZoom() - 10 : map.instance.getZoom() - 7);
                  }, 100);
    },
    drawPoint: function (e) {
        var t = this.poiInfoboxHTML.replace(/\n/g, ""),
            i = this.poiOptions,
            n = this.assetPath + this.poiIconFormat.replace(/{{category}}/g, e.icon);
        (ifStatement = /(\{\{if(.*?)\}\}(.*?)\{\{endif\}\})/g.exec(t)) && (t = e[ifStatement[2].trim()] ? t.replace(ifStatement[1], ifStatement[3]) : t.replace(ifStatement[1], ""));
        for (property in e) {
            var o = new RegExp("({{" + property + "}})", "g");
            t.match(o) && (t = t.replace(o, e[property]));
        }
        -1 < navigator.userAgent.indexOf("rv:11") || -1 < navigator.userAgent.indexOf("MSIE") ? (n += ".png") : this.icons[e.category] ? (n = this.icons[e.category]) : (n += ".svg");
        var a = new this.googleMap.Marker({ map: map.instance, position: new this.googleMap.LatLng(e.lat, e.lng), icon: n });
        this.poiMarkers.push($.extend(a, { category: e.category, id: e.id })), this.bindMarkerOpen(new InfoBox($.extend(i, { content: t })), a);
    },
    poiVisibility: function (t, e, i) {
        var n = this,
            o = new this.googleMap.LatLngBounds();
        if (
            (this.openWindow && !this.openWindow.isMain && this.openWindow.close(),
            this.poiMarkers.forEach(function (e) {
                ((i && !mapSettings.loadAll) || !i) && e.setVisible(!1), (e.category == t || (i && mapSettings.loadAll) || "all" == t) && (o.extend(e.position), e.setVisible(!0));
            }),
            (e && 310 <= $(window).width()) || 4 == neighborhoodSettings.layout)
        )
            this.instance.fitBounds(o), this.instance.setZoom(this.instance.getZoom());
        else if ($(window).width() < 310) {
            var a = new this.googleMap.LatLngBounds().extend(this.latlng);
            setTimeout(function () {
                n.instance.fitBounds(a), n.instance.setZoom(n.instance.getZoom() - 7);
            }, 100);
        }
    },
    bindMarkerOpen: function (i, n) {
        var o = this;
        this.bindTogglePoiInfobox(i, n),
            this.googleMap.event.addListener(n, "click", function () {
                if (4 == neighborhoodSettings.layout) {
                    var e = $("[data-poi-id=" + n.id + "]"),
                        t = o.$map.data("fixed") ? 0 : 309;
                    e.length && $("html, body").animate({ scrollTop: e.offset().top - o.$map.outerHeight() }, 200),
                        setTimeout(function () {
                           // o.openWindow.close(), o.openMarker(i, n);
                        }, t);
                } else o.openWindow && o.openWindow.close(), o.openMarker(i, n);
            });
    },
    openMarker: function (e, t, i) {
        this.openWindow && this.openWindow.close(),
            mapSettings.persistPinpoint ? (e.isMain ? $(".map__infobox-modal").removeClass("map__infobox-modal--pinpoint-only") : $(".map__infobox-modal").addClass("map__infobox-modal--pinpoint-only")) : this.mainInfoBox.close();
        var n = this.$poiToggleBox.filter("[data-poi-id=" + t.id + "]");
        e.open(this.instance, t),
            this.$poiToggleBox.removeClass("neighborhood__poi-category-link--active"),
            n.addClass("neighborhood__poi-category-link--active"),
            e.isMain || (this.openWindow = e),
            "poi-hidden" != n.parent().data("js-hook") || n.parent().is(":visible") || $("#load-all-poi").trigger("click"),
            e.isMain &&
                setTimeout(function () {
                    map.adjustPinpointPosition();
                }, 400);
    },
    adjustPinpointPosition: function () {
        var e = 0,
            t = -1 * ($(".map__infobox-pinpoint-wrap").outerHeight() - 30);
        $(".map__infobox").length && 312 <= $(window).width() && mapSettings.loadInfobox && (e = ($(".map__infobox").outerWidth() / 2.5) * -1), map.offsetCenter(map.latlng, e, t);
    },
    bindControls: function () {
        var i = this;
        if (!mapSettings.loadAll) {
            var e = this.$poiFilter.first();
            4 == neighborhoodSettings.layout &&
                this.$poiFilter.each(function () {
                    if ("all" != $(this).data("poi")) return (e = $(this)), !1;
                }),
                e.attr("data-selected", !0);
        }
        this.$poiFilter.click(function (e) {
            e.preventDefault(), (i.currentCategory = $(this).data("poi")), (i.categoryChanged = !0), i.poiVisibility(i.currentCategory, !0);
        }),
            this.googleMap.event.addListener(i.instance, "click", function () {
              //  mapSettings.persistPinpoint ? $(".map__infobox-modal").addClass("map__infobox-modal--pinpoint-only") : i.mainInfoBox.close(), i.openWindow && i.openWindow.close();
            }),
            this.$zoomIn.unbind().click(function (e) {
                e.preventDefault(), i.instance.setZoom(i.instance.getZoom() + i.zoomIncrement);
            }),
            this.$zoomOut.unbind().click(function (e) {
                e.preventDefault(), i.instance.setZoom(i.instance.getZoom() - i.zoomIncrement);
            }),
            this.$refresh.unbind().click(function (e) {
                if (
                    (e.preventDefault(),
                    (i.categoryChanged = !1),
                    mapSettings.loadAll || (i.currentCategory = i.defaultCategory),
                    i.$poiFilter.attr("data-selected", !1).removeClass("map-a__cat-link--active").removeClass("map-b__cat-link--active").removeClass("map-c__cat-link--active"),
                    4 == neighborhoodSettings.layout)
                ) {
                    var t = !0;
                    i.$poiCategory
                        .each(function () {
                            var e = $(this).find("[data-content-cell]");
                            $(this).find("[data-content-cell]").remove(), t ? $(this).append(e) : $(this).prepend(e), (t = !t);
                        })
                        .show();
                } else mapSettings.loadAll && i.$poiCategory.show();
                i.loadMap();
            });
    },
    bindTogglePoiInfobox: function (i, n) {
        var o = this;
        this.$poiToggleBox.filter("[data-poi-id=" + n.id + "]").click(function (e) {
            e.preventDefault();
            var t = o.$stickyHeader.length ? o.$mapBodyWrap.offset().top - o.$stickyHeader.outerHeight() : o.$mapBodyWrap.offset().top;
            7 == theme && ($("#header").hasClass("header--sticky-desktop_only") || $("#header").hasClass("header--sticky-desktop_mobile"))
                ? (t = o.$mapBodyWrap.offset().top - $("#header").outerHeight())
                : 8 != theme || $("#header").hasClass("header--sticky-desktop_only") || $("#header").hasClass("header--sticky-desktop_mobile") || (t = o.$mapBodyWrap.offset().top + $("#header").outerHeight()),
                (311 <= $(window).width() || 4 == neighborhoodSettings.layout) &&
                    (o.openWindow && o.openWindow.close(),
                    $("html, body").animate({ scrollTop: t }),
                    o.poiVisibility(n.category),
                    o.openMarker(i, n),
                    o.$poiToggleBox.removeClass(o.poiActiveClass),
                    $(this).addClass(o.poiActiveClass),
                    o.instance.panTo(new o.googleMap.LatLng(n.position.lat(), n.position.lng())));
        });
    },
    setOptions: function () {
        (this.latlng = new google.maps.LatLng(mapSettings.lat, mapSettings.lng)),
            (this.poiOptions = {
                content: null,
                disableAutoPan: !1,
                alignBottom: !0,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(0, -30),
                zIndex: null,
                boxClass: "map__infobox",
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: !1,
                pane: "floatPane",
                enableEventPropagation: !0,
            }),
            (this.pinpointOptions = {
                content: this.mainInfoboxHTML,
                disableAutoPan: !1,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(-71, -160),
                zIndex: 9999,
                boxStyle: {},
                boxClass: "map__infobox",
                closeBoxMargin: "-20px 43px 0 0",
                closeBoxURL: "",
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: !1,
                pane: "floatPane",
                enableEventPropagation: !0,
            }),
            (this.mapOptions = { zoom: mapSettings.defaultMapZoom, minZoom: 5, maxZoom: 25, scrollwheel: !1, center: this.latlng, mapTypeId: google.maps.MapTypeId.ROADMAP, mapTypeControl: !1, disableDefaultUI: !0, styles: this.mapStyles });
    },
    constructMapIcons: function () {
        var i = this;
        $("[id^=poi_icon]").each(function () {
            $(this)
                .find("circle")
                .first()
                .css({ fill: $(this).data("fill") });
            var e = new XMLSerializer().serializeToString($(this).find("svg")[0]),
                t = "data:image/svg+xml;base64," + btoa(e);
            new Image();
            i.icons[$(this).data("category")] = t;
        });
    },
    init: function () {
        this.dom(), this.definitions(), this.constructMapIcons(), this.onGoogleLoad(this.loadMap);
    },
};
function setupShareThis() {
    var n = $("#share-this-popup"),
        o = $("#share-link"),
        a = $("#share-loader"),
        s = "share-this-popup--show";
    n.data("loaded", "0"),
        o.on("click", function (e) {
            if ((e.preventDefault(), e.stopPropagation(), "0" == n.data("loaded"))) {
                a.show(), o.hide(), n.data("loaded", "1");
                var t = n.data("url") || "",
                    i = n.data("tweet-filter") || "GLOBAL";
                n.load(n.data("script"), { url: t, tweet_filter: i }, function () {
                    n.addClass(s), a.hide(), o.show();
                });
            } else n.toggleClass(s);
        }),
        $("body").click(function () {
            n.hasClass(s) && n.toggleClass(s);
        });
}
function _e(e) {
    return new config.element._instance(e);
}
$(function () {
    $("#map_canvas").length && map.init();
}),
    (function (o) {
        var e = {
            a: {
                dom: function () {
                    (this.$loadAll = o("#load-all-poi")), (this.$poiList = o('[data-js-hook="poi-list"]')), (this.$loadLocal = o('[data-js-hook="load-local-poi"]')), (this.$poi = o('[data-js-hook="poi-hidden"]'));
                },
                loadAll: function () {
                    var i = this;
                    this.$loadAll.click(function (e) {
                        e.preventDefault();
                        var t = o(this);
                        i.$poi.slideToggle(200, function () {
                            t.text(i.$poi.first().is(":visible") ? "Load Less" : "Load All");
                        });
                    });
                },
                loadLocal: function () {
                    var t = this;
                    this.$loadLocal.click(function (e) {
                        e.preventDefault(), o(this).toggleClass("neighborhood__poi-category-header--active"), t.$poiList.filter('[data-category="' + o(this).data("category") + '"]').slideToggle(200);
                    });
                },
                ready: function () {
                    this.dom(), this.loadAll(), this.loadLocal();
                },
            },
            b: {
                dom: function () {
                    (this.$loadLocal = o('[data-js-hook="load-local-poi"]')),
                        (this.$poi = o('[data-js-hook="poi-hidden"]')),
                        (this.$poiFilter = o('[data-js-hook="poi-filter"]')),
                        (this.$categorySelectLink = o("#category-select-link")),
                        (this.$categorySelectOptions = o("#category-select-options")),
                        (this.$poiCategory = o('[data-js-hook="poi-category"]'));
                },
                data: { activePoiFilterClass: "map-a__cat-link--active" },
                loadLocal: function () {
                    var n = this;
                    this.$loadLocal.click(function (e) {
                        e.preventDefault();
                        var t = o(this),
                            i = n.$poi.filter('[data-category="' + o(this).data("category") + '"]');
                        i.slideToggle(200, function () {
                            t.find('[data-js-hook="load-text"]').text(i.first().is(":visible") ? "- Load Less" : "+ Load ALl");
                        });
                    });
                },
                injectCategoryHTML: function () {
                    var e = this,
                        t = "";
                    setTimeout(function () {
                        (t = e.$poiFilter.filter("[data-selected=true]").length
                            ? e.$poiFilter.filter("[data-selected=true]").html()
                            : e.$poiFilter.filter('[data-poi="all"]').length
                            ? e.$poiFilter.filter('[data-poi="all"]').html()
                            : e.$poiFilter.eq(0).html()),
                            e.$categorySelectLink.html(t.replace("poi-filter", "poi-select-toggle"));
                    }, 500);
                },
                categorySelect: function () {
                    var i = this;
                    this.$categorySelectLink.click(function (e) {
                        e.preventDefault(), i.$categorySelectOptions.slideToggle(100);
                    }),
                        this.$poiFilter.click(function (e) {
                            if ("all" != o(this).data("poi")) var t = i.$poiCategory.hide().filter('[data-category="' + o(this).data("poi") + '"]');
                            else t = i.$poiCategory;
                            i.$poiFilter.attr("data-selected", !1).removeClass(i.data.activePoiFilterClass),
                                o(this).attr("data-selected", !0).addClass(i.data.activePoiFilterClass),
                                i.injectCategoryHTML(),
                                i.$categorySelectLink.trigger("click"),
                                t.show();
                        });
                },
                ready: function () {
                    this.dom(), this.loadLocal(), this.categorySelect(), this.injectCategoryHTML();
                },
            },
            c: {
                dom: function () {
                    (this.$map = o("#map")),
                        (this.$mapBody = o("#map-body")),
                        (this.$poi = o('[data-js-hook="poi-hidden"]')),
                        (this.$poiFilter = o('[data-js-hook="poi-filter"]')),
                        (this.$poiList = o("#poi-list")),
                        (this.$categorySelectLink = o("#category-select-link")),
                        (this.$categorySelectOptions = o("#category-select-options")),
                        (this.$poiCategory = o('[data-js-hook="poi-category"]')),
                        (this.$backToTop = o("#back-to-top"));
                },
                data: { activePoiFilterClass: "map-c__cat-link--active" },
                injectCategoryHTML: function () {
                    var e = this,
                        t = "";
                    setTimeout(function () {
                        (t = e.$poiFilter.filter("[data-selected=true]").length ? e.$poiFilter.filter("[data-selected=true]").html() : e.$poiFilter.filter('[data-poi="all"]').html()),
                            e.$categorySelectLink.html(t.replace("poi-filter", "poi-select-toggle"));
                    }, 500);
                },
                categorySelect: function () {
                    var n = this;
                    this.$categorySelectLink.click(function (e) {
                        e.preventDefault(), n.$categorySelectOptions.slideToggle(100);
                    }),
                        this.$poiFilter.click(function (e) {
                            if ("all" != o(this).data("poi")) var t = n.$poiCategory.hide().filter('[data-category="' + o(this).data("poi") + '"]');
                            else t = n.$poiCategory;
                            n.$poiFilter.attr("data-selected", !1).removeClass(n.data.activePoiFilterClass),
                                o(this).attr("data-selected", !0).addClass(n.data.activePoiFilterClass),
                                n.injectCategoryHTML(),
                                n.$categorySelectLink.trigger("click"),
                                n.$poiCategory.hide();
                            var i = !0;
                            t.each(function () {
                                var e = o(this).find("[data-content-cell]");
                                o(this).find("[data-content-cell]").remove(), i ? o(this).append(e) : o(this).prepend(e), (i = !i);
                            }).show();
                        });
                },
                ready: function () {
                    var e = this;
                    this.dom(), this.injectCategoryHTML(), this.categorySelect();
                    var t = o('<div id="map-placeholder"></div>');
                    this.$map.after(t),
                        this.$backToTop.click(function (e) {
                            e.preventDefault(), o("html, body").animate({ scrollTop: 0 }, 200);
                        }),
                        o(window).scroll(function () {
                            e.$map.data("fixed") &&
                                e.$map.offset().top <= t.offset().top &&
                                (e.$map.data("fixed", !1),
                                e.$map.css({ position: "relative" }).removeClass("map-c__fixed"),
                                311 < o(window).width() &&
                                    setTimeout(function () {
                                        map.loadMap(!1, !0);
                                    }, 500),
                                t.height(0)),
                                !e.$map.data("fixed") &&
                                    e.$map.offset().top - o(window).scrollTop() < 0 &&
                                    (e.$map.data("fixed", !0),
                                    e.$map.css({ position: "fixed", width: "100%", "z-index": 8900, top: 0 }).addClass("map-c__fixed"),
                                    311 < o(window).width() &&
                                        setTimeout(function () {
                                            map.loadMap(!1, !0);
                                        }, 500),
                                    t.height(e.$map.outerHeight()),
                                    setTimeout(function () {
                                        t.animate({ height: e.$map.outerHeight() }, 80);
                                    }, 50));
                        });
                },
            },
            ready: function () {
                switch (parseInt(neighborhoodSettings.layout)) {
                    case 1:
                        this.a.ready();
                        break;
                    case 2:
                    case 3:
                        this.b.ready();
                        break;
                    case 4:
                        this.c.ready();
                }
            },
        };
        o(function () {
            "undefined" != typeof neighborhoodSettings && e.ready();
        });
    })(jQuery),
    $(document).ready(function () {
        setupShareThis();
    }),
    (function (l) {
        var e = {
            domCache: function () {
                (this.leaseObject = {}),
                    (this.picker = null),
                    (this.$bindEl = null),
                    (this.$confirm = null),
                    (this.$table = l('[data-js-hook="panel"]').filter('[data-type="check-availability"]')),
                    (this.$unitSelect = l('[data-js-hook="lease-now"]')),
                    (this.$leaseButton = l('[data-js-hook="lease-button"]')),
                    (this.$leaseTerm = l('[data-js-hook="lease-term-input"]')),
                    (this.ysWorkflow = this.$table.data("ys-workflow"));
            },
            ysLeaseTermCache: {},
            selectedLeaseTerm: null,
            minDate: null,
            maxDate: null,
            injectBindElement: function (e) {
                var t = document.createElement("div");
                (t.id = "picker-bind"), (this.$bindEl = l(t)), l("body").prepend(this.$bindEl);
            },
            bindUnitSelect: function () {
                var i = this;
                this.$unitSelect.click(function (e) {
                    e.preventDefault(), e.stopPropagation();
                    var t = null;
                    l(this).data("lease-term") && (t = i.$leaseTerm.filter('[data-unit="' + l(this).data("unit") + '"]:checked').val()),
                        (i.leaseObject.unit = l(this).data("unit")),
                        (i.leaseObject.building = l(this).data("building")),
                        (i.leaseObject.id = l(this).data("id-value")),
                        (i.leaseObject.start = l(this).data("availability-start")),
                        (i.leaseObject.end = l(this).data("availability-end")),
                        (i.leaseObject.url = decodeURI(l(this).attr("href"))),
                        (i.leaseObject.date_format = l(this).data("date-format") || "mm-dd-yyyy"),
                        (i.leaseObject.lease_term = t),
                        (i.leaseObject.pic = l(this).data("pic")),
                        (i.leaseObject.yss = l(this).data("yss")),
                        i.openPickerInstance();
                });
            },
            confirmUrlInject: function () {
                this.$confirm &&
                    this.$confirm.attr(
                        "href",
                        this.leaseObject.url
                            .replace("{lease_term}", this.leaseObject.lease_term)
                            .replace("{unit_id}", this.leaseObject.id)
                            .replace("{unit}", this.leaseObject.unit)
                            .replace("{date}", this.picker.get("select", this.leaseObject.date_format))
                    );
            },
            pickadateInit: function () {
                this.picker = this.$bindEl.pickadate({ closeOnSelect: !1 }).data("pickadate").stop();
            },
            pickadateHTMLInject: function () {
                var e =
                    '<div id="custom-picker-confirm" class="picker__confirm-wrap">                            <a target="_blank" data-click-track="lease-now" type="button" id="picker-confirm" class="picker__confirm">                              Lease Now                            </a>                           </div>';
                this.ysWorkflow &&
                    (e =
                        '<div id="custom-picker-confirm" class="picker__confirm-wrap">                            <a style="display:none" target="_blank" type="button" id="back-to-calendar" class="picker__back">                                <span></span>Back                              </a>                            <a target="_blank" type="button" id="picker-view-lease-terms" class="picker__confirm">                              View Lease Terms                            </a>                            <a style="display:none;" data-click-track="lease-now" target="_blank" type="button" id="picker-confirm" class="picker__confirm">                              Lease Now                            </a>                          </div>'),
                    l("#custom-picker-header").remove(),
                    l("#custom-picker-confirm").remove(),
                    this.$pickerFrame.prepend('<div id="custom-picker-header" class="picker__custom-header">                            Desired Move-in Date                          </div>').append(e),
                    (this.$pickerHeader = l("#custom-picker-header")),
                    (this.$pickerConfirmWrap = l("#custom-picker-confirm")),
                    (this.$pickerConfirm = l("#picker-confirm")),
                    (this.$pickerBack = l("#back-to-calendar")),
                    (this.$pickerViewLeaseTerms = l("#picker-view-lease-terms")),
                    this.ysWorkflow && ((this.$leaseTermHolder = l('<div id="lease-term-loader" class="picker__loader"><img src="/views/site/images/global/icons/loading.gif" /></div>')), this.$pickerFrame.prepend(this.$leaseTermHolder)),
                    (this.$confirm = l("#picker-confirm")),
                    this.bindConfirmButton();
            },
            initCalendarModalElements: function () {
                this.$pickerFrame.removeClass("picker__frame--skinny"),
                    this.$pickerHeader.text("Desired Move-in Date"),
                    this.$pickerViewLeaseTerms.show(),
                    this.$pickerConfirm.hide(),
                    this.$pickerBack.hide(),
                    this.$pickerFrameWrap.show(),
                    this.$leaseTermWrap.hide();
            },
            initLeaseTermModalElements: function (e) {
                var t = this,
                    n = t.picker.get("highlight", "yyyy/mm/dd"),
                    o = new Date(n),
                    a = new Date(n);
                for (
                    o.setDate(o.getDate() + 1),
                        a.setDate(a.getDate() - 1),
                        this.$pickerFrame.addClass("picker__frame--skinny"),
                        this.$pickerHeader.html(
                            'Desired Lease Term <div style="display:none;">Showing lease terms for </div><div class="picker__lease-nav"> <a id="prev-day" href=""></a><strong>' +
                                t.picker.get("highlight", "mmm dd, yyyy") +
                                '</strong><a id="next-day" href=""></a></div>'
                        ),
                        this.$nextDay = l("#next-day"),
                        this.$prevDay = l("#prev-day"),
                        o > t.maxDate && this.$nextDay.addClass("inactive"),
                        a < t.minDate && this.$prevDay.addClass("inactive"),
                        this.$leaseTermWrap || ((this.$leaseTermWrap = l('<div class="lease-term-wrap"></div>')), t.$pickerFrameWrap.after(this.$leaseTermWrap)),
                        this.$leaseTermWrap.empty().show(),
                        i = 0;
                    i < e.length;
                    i++
                ) {
                    var s = e[i],
                        r = l('<div class="lease-term-wrap__item" data-term="' + s.leaseTerm + '">' + s.leaseTerm + " months at $" + s.finalRent + "/mo</div>");
                    s.best && r.append("<span>Best Price</span>"),
                        this.$leaseTermWrap.append(r),
                        r.click(function (e) {
                            e.preventDefault(),
                                l(".lease-term-wrap__item").removeClass("lease-term-wrap__item--active"),
                                l(this).addClass("lease-term-wrap__item--active"),
                                (t.leaseObject.lease_term = l(this).data("term")),
                                (t.selectedLeaseTerm = t.leaseObject.lease_term),
                                t.confirmUrlInject();
                        }),
                        ((t.selectedLeaseTerm && t.selectedLeaseTerm == s.leaseTerm) || (!t.selectedLeaseTerm && s.best)) && r.trigger("click");
                }
                this.$pickerViewLeaseTerms.hide(),
                    this.$pickerConfirm.show(),
                    this.$pickerBack.show(),
                    this.$nextDay.click(function (e) {
                        e.preventDefault(), t.picker.set("select", o), t.$pickerViewLeaseTerms.trigger("click");
                    }),
                    this.$prevDay.click(function (e) {
                        e.preventDefault(), t.picker.set("select", a), t.$pickerViewLeaseTerms.trigger("click");
                    }),
                    this.$pickerBack.click(function (e) {
                        e.preventDefault(), t.initCalendarModalElements();
                    }),
                    this.$pickerFrameWrap.hide();
            },
            bindConfirmButton: function (e) {
                var n = this;
                n.ysWorkflow &&
                    l("#picker-view-lease-terms").click(function (e) {
                        e.preventDefault();
                        l(this);
                        var t = n.picker.get("highlight", "yyyy-mm-dd"),
                            i = n.leaseObject.unit + "_" + n.leaseObject.building + "_" + t + "_" + n.leaseObject.pic + "_" + n.leaseObject.yss;
                        n.ysLeaseTermCache[i]
                            ? n.initLeaseTermModalElements(n.ysLeaseTermCache[i])
                            : (l("#custom-picker-confirm").find("a").addClass("inactive"),
                              l("#next-day").addClass("inactive"),
                              l("#prev-day").addClass("inactive"),
                              l("#lease-term-loader").fadeIn(200),
                              l("#custom-picker-error").length && l("#custom-picker-error").remove(),
                              l.get("/get-lease-terms/", { apartment: n.leaseObject.unit, building: n.leaseObject.building, moveindate: t, pic: n.leaseObject.pic, yss: n.leaseObject.yss }, function (e) {
                                  (e = JSON.parse(e)),
                                      (n.ysLeaseTermCache[i] = e.data),
                                      l("#lease-term-loader").fadeOut(200),
                                      l("#custom-picker-confirm").find("a").removeClass("inactive"),
                                      l("#next-day").removeClass("inactive"),
                                      l("#prev-day").removeClass("inactive"),
                                      e.data && e.data.length
                                          ? n.initLeaseTermModalElements(e.data)
                                          : l("#custom-picker-header").append('<div id="custom-picker-error" class="picker__error">No lease terms found. Please select a different date.</div>');
                              }));
                    }),
                    this.$confirm &&
                        this.$confirm.unbind().bind("click", function (e) {
                            n.picker && n.picker.close(), "undefined" != typeof JonahT ? JonahT.event.leaseNow(l(this).attr("href")) : "undefined" != typeof JonahTracking && JonahTracking.event.leaseNow(l(this).attr("href"));
                        });
            },
            openPickerInstance: function () {
                var e = this;
                if (e.leaseObject.start && e.leaseObject.end) {
                    var t = e.leaseObject.start.split("-"),
                        i = e.leaseObject.end.split("-");
                    (t = t.map(function (e) {
                        return parseInt(e);
                    })),
                        (i = i.map(function (e) {
                            return parseInt(e);
                        })),
                        (e.minDate = new Date(t.join("/"))),
                        (e.maxDate = new Date(i.join("/"))),
                        (t[1] = parseInt(t[1]) - 1),
                        (i[1] = parseInt(i[1]) - 1);
                }
                e.picker
                    .stop()
                    .start()
                    .set("disable", [{ from: t, to: i }])
                    .set("disable", "flip")
                    .set("select", t)
                    .on({
                        open: function () {
                            this.$root.css("z-index", maxZ() + 1),
                                this.$root.find(".picker__frame").addClass("picker__frame--premium picker__frame--flatten"),
                                (e.$pickerFrame = this.$root.find(".picker__frame")),
                                (e.$pickerFrameWrap = e.$pickerFrame.find(".picker__wrap")),
                                e.pickadateHTMLInject(),
                                e.confirmUrlInject();
                        },
                        set: function () {
                            e.confirmUrlInject();
                        },
                        close: function () {
                            e.picker.stop(), (e.$leaseTermWrap = null);
                        },
                    })
                    .open();
            },
            init: function () {
                this.domCache(), parseInt(this.$table.data("skip-step-init")) && (this.injectBindElement(), this.bindUnitSelect(), this.pickadateInit());
            },
        };
        l(function () {
            e.init();
        });
    })(jQuery);
config = { siteUrl: config.siteUrl, mobileBreak: 311 };
"function" == typeof WOW &&
    (config.wowInit =
        ((config.wow = new WOW()),
        void (config.wow.destroy = function () {
            $(".wow").removeClass("wow");
        }))),
    (config.request = {
        _cache: [],
        _request: function (e, t, i, n, o) {
            if (i instanceof Object || "string" == typeof i) var a = i;
            else {
                a = !1;
                console.log(i), (n = i);
            }
            var s = a ? e + ":" + t + "?" + $.param(a) : e + ":" + t,
                r = this._cache[s];
            r
                ? n(r, { fromCache: !0, cacheIndex: s })
                : $.ajax({
                      type: e,
                      url: t,
                      data: a,
                      success: function (e) {
                          (config.request._cache[s] = e), n(e, { fromCache: !1, cacheIndex: s });
                      },
                      dataType: o,
                      cache: !1,
                  });
        },
        post: function (e, t, i, n) {
            this._request(
                "POST",
                e,
                t,
                function (e, t) {
                    i(e, t);
                },
                n
            );
        },
        get: function (e, t, i, n) {
            this._request(
                "GET",
                e,
                t,
                function (e, t) {
                    i(e, t);
                },
                n
            );
        },
        load: function (e, t, n, o, a, s) {
            (s = s || "GET"),
                _e(e).ready(function (i) {
                    config.request._request(
                        s,
                        t,
                        n,
                        function (e, t) {
                            i.html(e), o(e, t);
                        },
                        a
                    );
                }, 300);
        },
    }),
    (config.element = {
        _instances: {},
        _instance: function (e) {
            var a = this;
            (this.sliding = !1),
                e instanceof jQuery ? (this.selector = e) : (this.selector = $(e)),
                (this.ready = function (i, n) {
                    $(function () {
                        var e,
                            t = 0;
                        e = setInterval(function () {
                            ++t, (a.selector.length || (n && t == n)) && (a.selector.length && i(a.selector), clearInterval(e));
                        }, 50);
                    });
                }),
                (this.load = function (e, t, i, n, o) {
                    config.request.load(
                        a.selector,
                        e,
                        t,
                        function (e, t) {
                            i(e, t);
                        },
                        n,
                        o
                    );
                }),
                (this.toggleText = function (t) {
                    a.ready(function (e) {
                        e.text(t.onCondition ? t[1] : t[0]);
                    });
                }),
                (this.centerScreenOn = function (t) {
                    (t = t || 200),
                        a.ready(function (e) {
                            $("html, body").animate({ scrollTop: e.offset().top - $(window).height() / 2 + e.outerHeight() / 2 }, t);
                        });
                }),
                (this.slideFadeDown = function (t, i) {
                    (t = t || 200),
                        a.ready(function (e) {
                            e.is(":visible") || e.css("opacity", 0).slideDown(t).animate({ opacity: 1 }, { queue: !1, duration: t, complete: i });
                        });
                }),
                (this.slideFadeUp = function (t, i) {
                    (t = t || 200),
                        a.ready(function (e) {
                            e.is(":visible") && e.css("opacity", 1).slideUp(t).animate({ opacity: 0 }, { queue: !1, duration: t, complete: i });
                        });
                }),
                (this.slideFadeToggle = function (t, i) {
                    a.ready(function (e) {
                        a.sliding ||
                            ((a.sliding = !0),
                            e.is(":visible")
                                ? a.slideFadeUp(t, function () {
                                      (a.sliding = !1), i && i();
                                  })
                                : a.slideFadeDown(t, function () {
                                      (a.sliding = !1), i && i();
                                  }));
                    });
                });
        },
    }),
    (config.location = {
        current: window.location.pathname.substr(1) ? window.location.pathname.substr(1).replace(/\/$/, "") : "index",
        root: window.location.pathname.split("/")[1],
        queryString: window.location.search,
        isRoot: function (e) {
            return e.replace(/(\/$|^\/)/g, "") === this.root;
        },
        isPage: function (e) {
            return e.replace(/(\/$|^\/)/g, "") === this.current;
        },
        getQueryString: function (e) {
            if (!window.location.search) return !1;
            if (e) var t = this.queryString;
            else {
                t = [];
                this.queryString
                    .replace(/(^\?)/, "")
                    .split("&")
                    .forEach(function (e) {
                        (e = e.split("=")), (t[decodeURIComponent(e[0])] = decodeURIComponent(e[1]));
                    });
            }
            return t;
        },
        getParam: function (e) {
            var t = this.getQueryString();
            return !!((e = e.trim()) && t && t[e]) && t[e];
        },
    }),
    (config.screen = {
        _resizeCallbacks: [],
        _resize: void $(window).on("load resize", function () {
            var t = $(window).width();
            (config.screen.size = t),
                config.screen._resizeCallbacks.length &&
                    config.screen._resizeCallbacks.forEach(function (e) {
                        e(t);
                    });
        }),
        size: $(window).width(),
        onResize: function (e) {
            config.screen._resizeCallbacks.push(e);
        },
        atSize: function (t, i) {
            config.screen.onResize(function (e) {
                e === t && i(e);
            });
        },
        whenSmallerThan: function (t, i) {
            var n = !1;
            return (
                config.screen.onResize(function (e) {
                    e < t ? n || (i(e), (n = !0)) : (n = !1);
                }),
                this
            );
        },
        whileSmallerThan: function (t, i) {
            return (
                config.screen.onResize(function (e) {
                    e < t && i(e);
                }),
                this
            );
        },
        whenLargerThan: function (t, i) {
            var n = !1;
            return (
                config.screen.onResize(function (e) {
                    t < e ? n || (i(e), (n = !0)) : (n = !1);
                }),
                this
            );
        },
        whileLargerThan: function (t, i) {
            return (
                config.screen.onResize(function (e) {
                    t < e && i(e);
                }),
                this
            );
        },
    }),
    (config.email = {
        elements: $("[data-mail-name]"),
        _convert: function (e) {
            e.attr("href", "mailto:" + e.data("mail-name") + "@" + e.data("mail-host")), e.text().length || e.text(e.data("mail-name") + "@" + e.data("mail-host")), e.removeAttr("data-mail-name"), e.removeAttr("data-mail-host");
        },
        mailToInject: function (e) {
            e
                ? config.email._convert(e)
                : config.email.elements.each(function () {
                      config.email._convert($(this));
                  });
        },
    }),
    config.email.mailToInject();








function InfoBox(e) {
        (e = e || {}),
            google.maps.OverlayView.apply(this, arguments),
            (this.content_ = e.content || ""),
            (this.disableAutoPan_ = e.disableAutoPan || !1),
            (this.maxWidth_ = e.maxWidth || 0),
            (this.pixelOffset_ = e.pixelOffset || new google.maps.Size(0, 0)),
            (this.position_ = e.position || new google.maps.LatLng(0, 0)),
            (this.zIndex_ = e.zIndex || null),
            (this.boxClass_ = e.boxClass || "infoBox"),
            (this.boxStyle_ = e.boxStyle || {}),
            (this.closeBoxMargin_ = e.closeBoxMargin || "2px"),
            (this.closeBoxURL_ = e.closeBoxURL || "//www.google.com/intl/en_us/mapfiles/close.gif"),
            "" === e.closeBoxURL && (this.closeBoxURL_ = ""),
            (this.closeBoxTitle_ = e.closeBoxTitle || " Close "),
            (this.infoBoxClearance_ = e.infoBoxClearance || new google.maps.Size(1, 1)),
            void 0 === e.visible && (void 0 === e.isHidden ? (e.visible = !0) : (e.visible = !e.isHidden)),
            (this.isHidden_ = !e.visible),
            (this.alignBottom_ = e.alignBottom || !1),
            (this.pane_ = e.pane || "floatPane"),
            (this.enableEventPropagation_ = e.enableEventPropagation || !1),
            (this.div_ = null),
            (this.closeListener_ = null),
            (this.moveListener_ = null),
            (this.contextListener_ = null),
            (this.eventListeners_ = null),
            (this.fixedWidthSet_ = null);
    }
    (InfoBox.prototype = new google.maps.OverlayView()),
        (InfoBox.prototype.createInfoBoxDiv_ = function () {
            var e,
                t,
                i,
                n = this,
                o = function (e) {
                    (e.cancelBubble = !0), e.stopPropagation && e.stopPropagation();
                };
            if (!this.div_) {
                if (
                    ((this.div_ = document.createElement("div")),
                    this.setBoxStyle_(),
                    void 0 === this.content_.nodeType ? (this.div_.innerHTML = this.getCloseBoxImg_() + this.content_) : ((this.div_.innerHTML = this.getCloseBoxImg_()), this.div_.appendChild(this.content_)),
                    this.getPanes()[this.pane_].appendChild(this.div_),
                    this.addClickHandler_(),
                    this.div_.style.width
                        ? (this.fixedWidthSet_ = !0)
                        : 0 !== this.maxWidth_ && this.div_.offsetWidth > this.maxWidth_
                        ? ((this.div_.style.width = this.maxWidth_), (this.div_.style.overflow = "auto"), (this.fixedWidthSet_ = !0))
                        : ((i = this.getBoxWidths_()), (this.div_.style.width = this.div_.offsetWidth - i.left - i.right + "px"), (this.fixedWidthSet_ = !1)),
                    this.panBox_(this.disableAutoPan_),
                    !this.enableEventPropagation_)
                ) {
                    for (this.eventListeners_ = [], t = ["mousedown", "mouseover", "mouseout", "mouseup", "click", "dblclick", "touchstart", "touchend", "touchmove"], e = 0; e < t.length; e++)
                        this.eventListeners_.push(google.maps.event.addDomListener(this.div_, t[e], o));
                    this.eventListeners_.push(
                        google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
                            this.style.cursor = "crosshair";
                        })
                    );
                }
                (this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", function (e) {
                    (e.returnValue = !1), e.preventDefault && e.preventDefault(), n.enableEventPropagation_ || o(e);
                })),
                    google.maps.event.trigger(this, "domready");
            }
        }),
        (InfoBox.prototype.getCloseBoxImg_ = function () {
            var e = "";
            return (
                "" !== this.closeBoxURL_ &&
                    ((e = "<img"),
                    (e += " src='" + this.closeBoxURL_ + "'"),
                    (e += " align=right"),
                    (e += " title='" + this.closeBoxTitle_ + "'"),
                    (e += " style='"),
                    (e += " position: relative;"),
                    (e += " cursor: pointer;"),
                    (e += " margin: " + this.closeBoxMargin_ + ";"),
                    (e += "'>")),
                e
            );
        }),
        (InfoBox.prototype.addClickHandler_ = function () {
            var e;
            "" !== this.closeBoxURL_ ? ((e = this.div_.firstChild), (this.closeListener_ = google.maps.event.addDomListener(e, "click", this.getCloseClickHandler_()))) : (this.closeListener_ = null);
        }),
        (InfoBox.prototype.getCloseClickHandler_ = function () {
            var t = this;
            return function (e) {
                (e.cancelBubble = !0), e.stopPropagation && e.stopPropagation(), google.maps.event.trigger(t, "closeclick"), t.close();
            };
        }),
        (InfoBox.prototype.panBox_ = function (e) {
            var t,
                i = 0,
                n = 0;
            if (!e && (t = this.getMap()) instanceof google.maps.Map) {
                t.getBounds().contains(this.position_) || t.setCenter(this.position_);
                var o = this.pixelOffset_.width,
                    a = this.pixelOffset_.height,
                    s = this.div_.offsetWidth,
                    r = this.div_.offsetHeight,
                    l = this.infoBoxClearance_.width,
                    c = this.infoBoxClearance_.height;
                if (2 == t.panToBounds.length) {
                    var d = { left: 0, right: 0, top: 0, bottom: 0 };
                    (d.left = -o + l), (d.right = o + s + l), this.alignBottom_ ? ((d.top = -a + c + r), (d.bottom = a + c)) : ((d.top = -a + c), (d.bottom = a + r + c)), t.panToBounds(new google.maps.LatLngBounds(this.position_), d);
                } else {
                    var u = t.getDiv(),
                        h = u.offsetWidth,
                        p = u.offsetHeight,
                        f = this.getProjection().fromLatLngToContainerPixel(this.position_);
                    if (
                        (f.x < -o + l ? (i = f.x + o - l) : f.x + s + o + l > h && (i = f.x + s + o + l - h),
                        this.alignBottom_ ? (f.y < -a + c + r ? (n = f.y + a - c - r) : f.y + a + c > p && (n = f.y + a + c - p)) : f.y < -a + c ? (n = f.y + a - c) : f.y + r + a + c > p && (n = f.y + r + a + c - p),
                        0 !== i || 0 !== n)
                    ) {
                        t.getCenter();
                        t.panBy(i, n);
                    }
                }
            }
        }),
        (InfoBox.prototype.setBoxStyle_ = function () {
            var e, t;
            if (this.div_) {
                for (e in ((this.div_.className = this.boxClass_), (this.div_.style.cssText = ""), (t = this.boxStyle_))) t.hasOwnProperty(e) && (this.div_.style[e] = t[e]);
                (void 0 === this.div_.style.WebkitTransform || (-1 === this.div_.style.WebkitTransform.indexOf("translateZ") && -1 === this.div_.style.WebkitTransform.indexOf("matrix"))) &&
                    (this.div_.style.WebkitTransform = "translateZ(0)"),
                    void 0 !== this.div_.style.opacity &&
                        "" !== this.div_.style.opacity &&
                        ((this.div_.style.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + 100 * this.div_.style.opacity + ')"'), (this.div_.style.filter = "alpha(opacity=" + 100 * this.div_.style.opacity + ")")),
                    (this.div_.style.position = "absolute"),
                    (this.div_.style.visibility = "hidden"),
                    null !== this.zIndex_ && (this.div_.style.zIndex = this.zIndex_);
            }
        }),
        (InfoBox.prototype.getBoxWidths_ = function () {
            var e,
                t = { top: 0, bottom: 0, left: 0, right: 0 },
                i = this.div_;
            return (
                document.defaultView && document.defaultView.getComputedStyle
                    ? (e = i.ownerDocument.defaultView.getComputedStyle(i, "")) &&
                      ((t.top = parseInt(e.borderTopWidth, 10) || 0), (t.bottom = parseInt(e.borderBottomWidth, 10) || 0), (t.left = parseInt(e.borderLeftWidth, 10) || 0), (t.right = parseInt(e.borderRightWidth, 10) || 0))
                    : document.documentElement.currentStyle &&
                      i.currentStyle &&
                      ((t.top = parseInt(i.currentStyle.borderTopWidth, 10) || 0),
                      (t.bottom = parseInt(i.currentStyle.borderBottomWidth, 10) || 0),
                      (t.left = parseInt(i.currentStyle.borderLeftWidth, 10) || 0),
                      (t.right = parseInt(i.currentStyle.borderRightWidth, 10) || 0)),
                t
            );
        }),
        (InfoBox.prototype.onRemove = function () {
            this.div_ && (this.div_.parentNode.removeChild(this.div_), (this.div_ = null));
        }),
        (InfoBox.prototype.draw = function () {
            this.createInfoBoxDiv_();
            var e = this.getProjection().fromLatLngToDivPixel(this.position_);
            (this.div_.style.left = e.x + this.pixelOffset_.width + "px"),
                this.alignBottom_ ? (this.div_.style.bottom = -(e.y + this.pixelOffset_.height) + "px") : (this.div_.style.top = e.y + this.pixelOffset_.height + "px"),
                this.isHidden_ ? (this.div_.style.visibility = "hidden") : (this.div_.style.visibility = "visible");
        }),
        (InfoBox.prototype.setOptions = function (e) {
            void 0 !== e.boxClass && ((this.boxClass_ = e.boxClass), this.setBoxStyle_()),
                void 0 !== e.boxStyle && ((this.boxStyle_ = e.boxStyle), this.setBoxStyle_()),
                void 0 !== e.content && this.setContent(e.content),
                void 0 !== e.disableAutoPan && (this.disableAutoPan_ = e.disableAutoPan),
                void 0 !== e.maxWidth && (this.maxWidth_ = e.maxWidth),
                void 0 !== e.pixelOffset && (this.pixelOffset_ = e.pixelOffset),
                void 0 !== e.alignBottom && (this.alignBottom_ = e.alignBottom),
                void 0 !== e.position && this.setPosition(e.position),
                void 0 !== e.zIndex && this.setZIndex(e.zIndex),
                void 0 !== e.closeBoxMargin && (this.closeBoxMargin_ = e.closeBoxMargin),
                void 0 !== e.closeBoxURL && (this.closeBoxURL_ = e.closeBoxURL),
                void 0 !== e.closeBoxTitle && (this.closeBoxTitle_ = e.closeBoxTitle),
                void 0 !== e.infoBoxClearance && (this.infoBoxClearance_ = e.infoBoxClearance),
                void 0 !== e.isHidden && (this.isHidden_ = e.isHidden),
                void 0 !== e.visible && (this.isHidden_ = !e.visible),
                void 0 !== e.enableEventPropagation && (this.enableEventPropagation_ = e.enableEventPropagation),
                this.div_ && this.draw();
        }),
        (InfoBox.prototype.setContent = function (e) {
            (this.content_ = e),
                this.div_ &&
                    (this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), (this.closeListener_ = null)),
                    this.fixedWidthSet_ || (this.div_.style.width = ""),
                    void 0 === e.nodeType ? (this.div_.innerHTML = this.getCloseBoxImg_() + e) : ((this.div_.innerHTML = this.getCloseBoxImg_()), this.div_.appendChild(e)),
                    this.fixedWidthSet_ ||
                        ((this.div_.style.width = this.div_.offsetWidth + "px"), void 0 === e.nodeType ? (this.div_.innerHTML = this.getCloseBoxImg_() + e) : ((this.div_.innerHTML = this.getCloseBoxImg_()), this.div_.appendChild(e))),
                    this.addClickHandler_()),
                google.maps.event.trigger(this, "content_changed");
        }),
        (InfoBox.prototype.setPosition = function (e) {
            (this.position_ = e), this.div_ && this.draw(), google.maps.event.trigger(this, "position_changed");
        }),
        (InfoBox.prototype.setZIndex = function (e) {
            (this.zIndex_ = e), this.div_ && (this.div_.style.zIndex = e), google.maps.event.trigger(this, "zindex_changed");
        }),
        (InfoBox.prototype.setVisible = function (e) {
            (this.isHidden_ = !e), this.div_ && (this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible");
        }),
        (InfoBox.prototype.getContent = function () {
            return this.content_;
        }),
        (InfoBox.prototype.getPosition = function () {
            return this.position_;
        }),
        (InfoBox.prototype.getZIndex = function () {
            return this.zIndex_;
        }),
        (InfoBox.prototype.getVisible = function () {
            return void 0 !== this.getMap() && null !== this.getMap() && !this.isHidden_;
        }),
        (InfoBox.prototype.getWidth = function () {
            var e = null;
            return this.div_ && (e = this.div_.offsetWidth), e;
        }),
        (InfoBox.prototype.getHeight = function () {
            var e = null;
            return this.div_ && (e = this.div_.offsetHeight), e;
        }),
        (InfoBox.prototype.show = function () {
            (this.isHidden_ = !1), this.div_ && (this.div_.style.visibility = "visible");
        }),
        (InfoBox.prototype.hide = function () {
            (this.isHidden_ = !0), this.div_ && (this.div_.style.visibility = "hidden");
        }),
        (InfoBox.prototype.open = function (e, t) {
            var i = this;
            t &&
                (this.setPosition(t.getPosition()),
                (this.moveListener_ = google.maps.event.addListener(t, "position_changed", function () {
                    i.setPosition(this.getPosition());
                }))),
                this.setMap(e),
                this.div_ && this.panBox_(this.disableAutoPan_);
        }),
        (InfoBox.prototype.close = function () {
            var e;
            if ((this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), (this.closeListener_ = null)), this.eventListeners_)) {
                for (e = 0; e < this.eventListeners_.length; e++) google.maps.event.removeListener(this.eventListeners_[e]);
                this.eventListeners_ = null;
            }
            this.moveListener_ && (google.maps.event.removeListener(this.moveListener_), (this.moveListener_ = null)),
                this.contextListener_ && (google.maps.event.removeListener(this.contextListener_), (this.contextListener_ = null)),
                this.setMap(null);
        });