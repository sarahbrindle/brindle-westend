<?php

add_action('init', 'floorplans_type');

function floorplans_type() {

    $imagepath = get_stylesheet_directory_uri() . '/cpt/images/';

    $labels    = array(

        'name' => __('Floorplans', 'brindle_tierra'),

        'singular_name' => __('Floorplans', 'brindle_tierra'),

        'add_new' => __('Add New floorplans', 'brindle_tierra'),

        'add_new_item' => __('Add New floorplans', 'brindle_tierra'),

        'edit' => __('Edit', 'brindle_tierra'),

        'edit_item' => __('Edit floorplans', 'brindle_tierra'),

        'new_item' => __('New floorplans', 'brindle_tierra'),

        'view' => __('View floorplans', 'brindle_tierra'),

        'view_item' => __('View floorplans', 'brindle_tierra'),

        'search_items' => __('Search floorplans', 'brindle_tierra'),

        'not_found' => __('No floorplans found', 'brindle_tierra'),

        'not_found_in_trash' => __('No floorplans found in Trash', 'brindle_tierra'),

        'parent_item_colon' => ''

    );

    $args      = array(

        'labels' => $labels,

        'description' => 'This is the holding location for all floorplans',

        'public' => true,

        'publicly_queryable' => true,

        'exclude_from_search' => false,

        'show_ui' => true,

        'query_var' => true,

        'capability_type' => 'post',

        'rewrite' => true,

        'hierarchical' => true,

        'menu_position' => 5,

        'menu_icon' => $imagepath . 'neighborhood.png',

        'supports' => array( 'title','editor'),

    );

    register_post_type('floorplans', $args);
    register_taxonomy("sizes", array("floorplans"), array("hierarchical" => true,"show_admin_column" =>true, "label" => "Sizes", "singular_label" => "Sizes", "rewrite" => true));

}

?>