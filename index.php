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
// }
// if (isset($args[0]) && $args[0] === 'room') {
//     $controller->rooms();
// } else if (isset($args[0]) && $args[0] === 'rooms') {
//     $controller->roomList();
// } else if (isset($args[0]) && $args[0] === 'account') {
//     $controller->account();
// } else if (isset($args[0]) && $args[0] === 'register') {
//     $controller->register();
// } else {
//     $controller->roomList();
// }


exit;
