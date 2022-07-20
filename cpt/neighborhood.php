<?php

add_action('init', 'Neighborhood_type');

function Neighborhood_type() {

    $imagepath = get_stylesheet_directory_uri() . '/cpt/images/';

    $labels    = array(

        'name' => __('Neighborhood', 'brindle_tierra'),

        'singular_name' => __('Neighborhood', 'brindle_tierra'),

        'add_new' => __('Add New Neighborhood', 'brindle_tierra'),

        'add_new_item' => __('Add New Neighborhood', 'brindle_tierra'),

        'edit' => __('Edit', 'brindle_tierra'),

        'edit_item' => __('Edit Neighborhood', 'brindle_tierra'),

        'new_item' => __('New Neighborhood', 'brindle_tierra'),

        'view' => __('View Neighborhood', 'brindle_tierra'),

        'view_item' => __('View Neighborhood', 'brindle_tierra'),

        'search_items' => __('Search Neighborhood', 'brindle_tierra'),

        'not_found' => __('No Neighborhood found', 'brindle_tierra'),

        'not_found_in_trash' => __('No Neighborhood found in Trash', 'brindle_tierra'),

        'parent_item_colon' => ''

    );

    $args      = array(

        'labels' => $labels,

        'description' => 'This is the holding location for all Neighborhood',

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

    register_post_type('neighborhood', $args);
    register_taxonomy("neighborhood_cat", array("neighborhood"), array("hierarchical" => true,"show_admin_column" =>true, "label" => "Neighborhood Categories", "singular_label" => "Neighborhood Category", "rewrite" => true));

}

?>