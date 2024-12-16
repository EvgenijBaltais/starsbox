<?
	$weights = get_weights($data);
	$brands = get_brands($data);
	$get_weight = check_get_weight ($weights);
?>
<div class = "catalog-filters section">
	<section class = "filters-blocks-items filters-products">
		<div class = "catalog-titles-w">
			<h3 class="h4-title">Фильтры:</h3>
			<span class = "down-to-products scroll-to" data-scroll-to = "assortment">К товарам</span>
		</div>
		<div class = "filters-blocks">
			<a class = "filters-block-item<? if ($_SERVER['REQUEST_URI'] == '/catalog' || strpos($_SERVER['REQUEST_URI'], '/catalog?') !== false): ?> active<? endif;?>" href = "/catalog">
				Все
			</a>
			<a class = "filters-block-item<? if (strpos($_SERVER['REQUEST_URI'], 'kofe_v_zernah')): ?> active<? endif;?>" href = "/catalog/kofe_v_zernah">
				Кофе в зернах
			</a>
			<a class = "filters-block-item<? if (strpos($_SERVER['REQUEST_URI'], 'molotiy_kofe')): ?> active<? endif;?>" href = "/catalog/molotiy_kofe">
				Кофе молотый
			</a>
		</div>
	</section>
	<section class = "filters-brands-blocks-items filters-brands">
		<h3 class="h4-title">Бренды:</h3>
		<div class = "filters-brands-blocks">
			<span class = "filter-item filters-block-item all-filter-item active">Все</span>
			<? foreach ($brands as $item): ?>
				<?
					$dataBrand = strtolower(str_replace(' ', '-', $item));
					$dataBrand = strtolower(str_replace('(', '', $dataBrand));
					$dataBrand = strtolower(str_replace(')', '', $dataBrand));
				?>
				<span class = "filter-item filters-block-item filters-brand-item" data-brand= "<?=$dataBrand;?>"><?=$item;?></span>
			<? endforeach; ?>
		</div>
	</section>
	<section class = "filters-blocks-items filters-volume">
		<h3 class="h4-title">Показать товары по весу:</h3>
		<div class = "filters-blocks">
			<span class = "filter-item filters-block-item all-filter-item active">Все</span>
			<? foreach ($weights as $item): ?>
				<? (int)$item == '1' ? $dataItem = 1000 : $dataItem = (int)$item;?>
				<span class = "filter-item filters-block-item filters-weight-item<?=$get_weight == $item ? ' active' : '';?>" data-weight = "<?=$dataItem;?>"><?=$item == 1000 ? '1 кг' : $item . ' г';?></span>
			<? endforeach; ?>
		</div>
	</section>
	<button class = "clear-filters">Сбросить фильтры</button>
</div>