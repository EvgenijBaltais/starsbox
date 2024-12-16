<?

$breadcrumbs = '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href = "/">Главная</a></li>';
strpos($_SERVER["REQUEST_URI"], 'catalog') ? $breadcrumbs .= '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span>&nbsp;→&nbsp;Каталог</span></li>' : '';
strpos($_SERVER["REQUEST_URI"], 'kofe_v_zernah') ? $breadcrumbs = '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href = "/">Главная</a></li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">&nbsp;→&nbsp;<a href = "/catalog">Каталог</a></li><li>&nbsp;→&nbsp;<span>Кофе в зернах</span></li>' : '';
strpos($_SERVER["REQUEST_URI"], 'molotiy_kofe') ? $breadcrumbs = '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href = "/">Главная</a></li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">&nbsp;→&nbsp;<a href = "/catalog">Каталог</a></li><li>&nbsp;→&nbsp;<span>Кофе молотый</span></li>' : '';

if (isset($url_item)) {
	$breadcrumbs = '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href = "/">Главная</a></li><li>&nbsp;→&nbsp;<a href = "/catalog">Каталог</a></li>';
	$item['category'] == 'Кофе в зернах' ? $breadcrumbs .= '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">&nbsp;→&nbsp;<a href = "/catalog/kofe_v_zernah">Кофе в зернах</a></li>' : '';
	$item['category'] == 'Кофе молотый' ? $breadcrumbs .= '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">&nbsp;→&nbsp;<a href = "/catalog/molotiy_kofe">Кофе молотый</a></li>' : '';
	$breadcrumbs .= '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">&nbsp;→&nbsp;<span>' . $item['brand'] . ' ' . $item['name'] . ' ' . $item['weight'] . '</span></li>';
}

?>

<div class = "breadcrumbs section">
	<ul class = "breadcrumbs-list" itemscope itemtype="http://schema.org/BreadcrumbList">
		<?=$breadcrumbs;?>
	</ul>
</div>
