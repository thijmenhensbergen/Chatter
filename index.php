<?php

require_once("vendor/autoload.php");
use Controllers\Controller;

if (isset($_GET["q"])) {
    $args = explode("/", $_GET["q"]);
} else {
    $args = [];
}
$controller = new Controller();
if (isset($args[0]) && method_exists($controller, $args[0])) {
    $method = strtolower($args[0]);
    $controller->$method();
} else {
    $controller->roomList();
}


exit;
