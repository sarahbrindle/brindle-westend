<?php

	
	add_action( 'enqueue_block_editor_assets', function() {	    
	        wp_add_inline_style( 'generate-block-editor-styles',wtp_base_css() );	   
	}, 50 );

	add_action( 'wp_enqueue_scripts', function() {
	    wp_add_inline_style( 'generate-style', wtp_base_css() );
	}, 100 );

	function wtp_base_css() {
			if ( ! function_exists( 'generate_get_defaults' ) ) {
		        return;
		    }

			$generate_settings  = wp_parse_args(
				get_option( 'generate_settings', array() ),
				generate_get_defaults()
			);
			if ( ! class_exists( 'GeneratePress_CSS' ) ) {
		        return;
		    }
			$css = new GeneratePress_CSS;

			/*Top Bar*/
			$css->set_selector( '.top-bar p' );
			$css->add_property( 'color', $generate_settings['top_bar_text_color'].'!important' );
			$css->set_selector( '.top-bar p a' );
			$css->add_property( 'color', $generate_settings['top_bar_link_color'].'!important' );
			$css->set_selector( '.top-bar p a:hover' );
			$css->add_property( 'color', $generate_settings['top_bar_link_color_hover'].'!important' );

			/*Header Navigation*/
			$css->set_selector( 'body .main-navigation .main-nav ul.sub-menu li:last-child a' );
			$css->add_property( 'color', $generate_settings['subnavigation_text_color']);
			$css->add_property( 'background-color', $generate_settings['subnavigation_background_color']);

			$css->set_selector( 'body .main-navigation .main-nav ul.sub-menu li:last-child a:hover' );
			$css->add_property( 'color', $generate_settings['subnavigation_text_hover_color'].'!important' );
			$css->add_property( 'background-color', $generate_settings['subnavigation_background_hover_color'].'!important' );

			$css->set_selector( '.main-navigation .main-nav ul ul li[class*="current-menu-"] > a' );
			$css->add_property( 'color', $generate_settings['subnavigation_text_current_color'].'!important' );
			$css->add_property( 'background-color', $generate_settings['subnavigation_background_current_color'].'!important' );

			

			/*Header Button*/
			$css->set_selector( 'body .main-navigation .main-nav ul li:last-child a' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'] );
			$css->add_property( 'color', $generate_settings['form_button_text_color'] );

			$css->set_selector( 'body .main-navigation .main-nav ul li:last-child a:hover' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color_hover'] );
			$css->add_property( 'color', $generate_settings['form_button_text_color_hover'] );

			$css->set_selector( 'body .site-header .main-navigation .main-nav ul li:last-child[class*="current-menu-"] > a' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color_hover'] );
			$css->add_property( 'color', $generate_settings['form_button_text_color_hover'] );

			/*Header Active Menu Border*/
			$css->set_selector( 'body .site-header .main-navigation .main-nav ul li[class*="current-menu-"] > a::after' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'] );


			/*OutLine Button*/
			$css->set_selector( '.wp-block-button.page-btn-outline > a.wp-block-button__link' );
			$css->add_property( 'border-color', $generate_settings['form_button_background_color'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color'] );

			$css->set_selector( '.wp-block-button.page-btn-outline > a.wp-block-button__link:hover' );
			$css->add_property( 'border-color', $generate_settings['form_button_background_color_hover'].'!important' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color_hover'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color_hover'] );

			/*Floorplan Tab Block Button*/
			$css->set_selector( '.wp-block-ub-tabbed-content-tab-title-wrap active, .wp-block-ub-tabbed-content-tab-title-wrap.active' );
			$css->add_property( 'color', $generate_settings['form_button_background_color'].'!important' );
			$css->set_selector( 'body .wp-block-ub-tabbed-content .wp-block-ub-tabbed-content-tabs-content,#ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-tab-title-wrap.active, #ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active, #ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-accordion-toggle.active, #ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-tab-title-wrap.active, #ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active, body #ub-tabbed-content-32cd306b-546c-43d5-8c08-015d8d544f96 .wp-block-ub-tabbed-content-accordion-toggle.active' );
			$css->add_property( 'background-color', $generate_settings['form_button_text_color'].'!important' );


			/*Amenities List Border*/
			$css->set_selector( 'ul.full-list li' );
			$css->add_property( 'border-color', $generate_settings['form_button_background_color'].'!important' );

			/*Responsive Tab*/

			$css->set_selector( '.gb-container.neighborhood-container ul.resp-tabs-list' );
			$css->add_property( 'background-color', $generate_settings['form_button_text_color'].'!important' );


			$css->set_selector( 'body .resp-tabs-list li.resp-tab-item' );
			$css->add_property( 'color', $generate_settings['top_bar_background_color'].'!important' );
			$css->add_property( 'background-color', $generate_settings['form_button_text_color'].'!important' );

			$css->set_selector( 'body .resp-tabs-list li.resp-tab-active, body .resp-tab-item:hover' );
			$css->add_property( 'color', $generate_settings['form_button_background_color'].'!important' );
			$css->add_property( 'background-color', $generate_settings['top_bar_background_color'].'!important' );

			$css->set_selector( '.gb-container.neighborhood-container .tab-grid h4' );
			$css->add_property( 'color', $generate_settings['form_button_background_color'].'!important' );

			$css->set_selector( '.gb-container.neighborhood-container .resp-tabs-container' );
			$css->add_property( 'background-color', $generate_settings['top_bar_background_color'].'!important' );

			$css->set_selector( '.gb-container.neighborhood-container ul.resp-tabs-list li+li::before' );
			$css->add_property( 'background-color', $generate_settings['top_bar_background_color'].'!important' );


			/*Neighborhood with map Tab*/

			$css->set_selector( 'body .map-a__cat-item,body .map-a__cat-link-column' );
			$css->add_property( 'color', $generate_settings['h3_color'].'!important' );

			$css->set_selector( '.map-a__cat-selected' );
			$css->add_property( 'color', $generate_settings['h4_color'].'!important' );

			

			$css->set_selector( 'body .neighborhood-b__poi,body .map-a__cat-link[data-selected="true"],body .map-a__cat-selected' );
			$css->add_property( 'background-color', $generate_settings['h3_color'].'!important' );
			$css->add_property( 'color', $generate_settings['h4_color'].'!important' );



			$css->set_selector( 'body .map-a__cat-item' );
			$css->add_property( 'background-color', $generate_settings['top_bar_text_color'].'!important' );

			

			$css->set_selector( 'body .tab-grid h4,body .map__infobox-poi-address-header' );
			$css->add_property( 'color', $generate_settings['h4_color'].'!important' );
			

			$css->set_selector( 'body .neighborhood-b__poi-category-list-item' );
			$css->add_property( 'border-color', $generate_settings['h4_color'].'!important' );

			$css->set_selector( 'body .neighborhood-b__poi-category-item-title,body .neighborhood-b__poi-category-item-title' );
			$css->add_property( 'color', $generate_settings['top_bar_text_color'].'!important' );

			$css->set_selector( 'body .map-a__cat-link[data-selected="true"] .map-a__cat-link-column,body .map-a__cat-link:hover:not(.map-a__cat-link--active)' );
			$css->add_property( 'color', $generate_settings['h4_color'].'!important' );

			$css->set_selector( ' body .map-a__cat-link::before' );
			$css->add_property( 'background', $generate_settings['h3_color'].'!important' );

			

			

			

			/*Vertical Tab Apartment Container Border*/
			$css->set_selector( 'body .gb-container.apartments-tab-container .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active::before' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'].'!important' );

			$css->set_selector( 'body .gb-container.apartments-tab-container .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active' );
			$css->add_property( 'color', $generate_settings['form_button_background_color'].'!important' );



			/*Gallery Filter*/
			$css->set_selector( '.vp-filter__item a' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color'].'!important' );

			$css->set_selector( '.vp-filter__item.vp-filter__item-active a,.vp-filteritem a:hover, .vp-filter_item a:focus,.vp-filter__item a:hover' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color_hover'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color_hover'].'!important' );


			/*Floor Plan Filter*/
			$css->set_selector( '.floorplangrid .filters a,.floorplangrid a.button' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color'].'!important' );

			$css->set_selector( '.floorplangrid .filters a.active,.floorplangrid .filters a:hover,.floorplangrid a.button:hover' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color_hover'].'!important' );
			$css->add_property( 'color', $generate_settings['form_button_text_color_hover'].'!important' );


			/*Widget Title*/
			$css->set_selector( 'h2.widget-title' );
			$css->add_property( 'font-family', $generate_settings['font_body'].'!important' );

			/*Testimonial Budget*/
			$css->set_selector( 'body .wp-block-eedee-block-gutenslider .swiper-pagination-bullet-active' );
			$css->add_property( 'background-color', $generate_settings['form_button_background_color'].'!important' );
			/*GF Styling*/
			$css->set_selector( 'input[type="text"], input[type="email"], input[type="url"], input[type="password"], input[type="search"], input[type="tel"], input[type="number"], textarea, select, .gform_wrapper.gravity-theme input[type="color"], .gform_wrapper.gravity-theme input[type="date"], .gform_wrapper.gravity-theme input[type="datetime-local"], .gform_wrapper.gravity-theme input[type="datetime"], .gform_wrapper.gravity-theme input[type="email"], .gform_wrapper.gravity-theme input[type="month"], .gform_wrapper.gravity-theme input[type="number"], .gform_wrapper.gravity-theme input[type="password"], .gform_wrapper.gravity-theme input[type="search"], .gform_wrapper.gravity-theme input[type="tel"], .gform_wrapper.gravity-theme input[type="text"], .gform_wrapper.gravity-theme input[type="time"], .gform_wrapper.gravity-theme input[type="url"], .gform_wrapper.gravity-theme input[type="week"], .gform_wrapper.gravity-theme select, .gform_wrapper.gravity-theme textarea{' );
			$css->add_property( 'border-color', $generate_settings['form_button_background_color'].'!important' );

			//do_action( 'generate_base_css', $css );

			return apply_filters( 'wtp_base_css_output', $css->css_output() );
	}
