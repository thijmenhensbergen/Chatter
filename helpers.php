<?php

function buildTemplate(string $file, array $context = []) 
{
    $loader = new Twig\Loader\FilesystemLoader("views");
    $twig = new Twig\Environment($loader);
    $template = $twig->load($file);
    echo $template->render($context);
}
function error($errorNumber, $errorMessage)
{
    $loader = new Twig\Loader\FilesystemLoader("views");
    $twig = new Twig\Environment($loader);
    $template = $twig->load("/error.twig");
    echo $template->render(["errorNumber" => $errorNumber, "errorMessage" => $errorMessage]);
    http_response_code($errorNumber);
    die;
}

?>