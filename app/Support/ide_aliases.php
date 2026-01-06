<?php
// IDE helper stub: defines lightweight class aliases so static analyzers/IDEs
// do not show "Undefined class XAuthService". This file is safe at runtime
// because it checks class existence before declaring.

if (!class_exists('XAuthService')) {
    class XAuthService extends \Vsd\Xauth\Services\AuthService {}
}

?>