<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem query()
 */
	class CartItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $items
 * @property-read int|null $items_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order query()
 */
	class Order extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrderItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrderItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrderItem query()
 */
	class OrderItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_turn14_brand
 * @property int $brand_id
 * @property string $name
 * @property string $logo
 * @property bool $sync_active
 * @property int|null $category_id
 * @property string $date_add
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Turn14Product> $products
 * @property-read int|null $products_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereIdTurn14Brand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Brand whereSyncActive($value)
 */
	class Turn14Brand extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $id_customer
 * @property string $secure_key
 * @property int $id_vehicle_filter
 * @property int $stage
 * @property string $date_add
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereIdCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereIdVehicleFilter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereSecureKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14CustomerGarage whereStage($value)
 */
	class Turn14CustomerGarage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_override
 * @property string $type
 * @property int|null $brand_id
 * @property string|null $brand_name
 * @property string|null $keyword
 * @property float $duty_rate
 * @property string $date_add
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereBrandName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereDutyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereIdOverride($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereKeyword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14DutyOverride whereType($value)
 */
	class Turn14DutyOverride extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_engine_filter
 * @property int $id_make
 * @property string $make
 * @property string $engine
 * @property string $image
 * @property bool $active
 * @property string $date_add
 * @property string $date_upd
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereDateUpd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereEngine($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereIdEngineFilter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereIdMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14EngineFilter whereMake($value)
 */
	class Turn14EngineFilter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_turn14_product
 * @property string $id
 * @property string $product_name
 * @property string|null $part_number
 * @property string|null $mfr_part_number
 * @property string $part_description
 * @property int|null $brand_id
 * @property string $category
 * @property string $subcategory
 * @property string|null $thumbnail
 * @property string|null $barcode
 * @property int|null $category_id
 * @property int|null $product_category_id
 * @property float|null $length
 * @property float|null $width
 * @property float|null $height
 * @property float|null $weight
 * @property bool $sync_active
 * @property bool|null $discontinued
 * @property int|null $brand_category_id
 * @property string $date_upd
 * @property int|null $units_per_sku
 * @property bool|null $ltl_freight_required
 * @property array<array-key, mixed>|null $dimensions
 * @property bool|null $special_order
 * @property bool $is_kit
 * @property bool $air_freight_prohibited
 * @property bool $clearance_item
 * @property float $usd_price
 * @property bool $can_purchase
 * @property-read \App\Models\Turn14Brand|null $brand
 * @property-read \App\Models\Turn14ProductMap|null $productMap
 * @property-read \App\Models\Turn14Stock|null $stock
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product forVehicle(int $idVehicleFilter)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereAirFreightProhibited($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereBarcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereBrandCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereCanPurchase($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereClearanceItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereDateUpd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereDimensions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereDiscontinued($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereIdTurn14Product($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereIsKit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereLength($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereLtlFreightRequired($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereMfrPartNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product wherePartDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product wherePartNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereProductCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereProductName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereSpecialOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereSubcategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereSyncActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereThumbnail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereUnitsPerSku($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereUsdPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereWeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Product whereWidth($value)
 */
	class Turn14Product extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $turn14_product_id
 * @property int $product_id
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14ProductMap newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14ProductMap newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14ProductMap query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14ProductMap whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14ProductMap whereTurn14ProductId($value)
 */
	class Turn14ProductMap extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_turn14_stock
 * @property string $turn14_product_id
 * @property int|null $quantity
 * @property int|null $mfr_quantity
 * @property \Illuminate\Support\Carbon|null $mfr_esd
 * @property array<array-key, mixed>|null $warehouse_stock
 * @property string $date_upd
 * @property-read \App\Models\Turn14Product|null $product
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereDateUpd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereIdTurn14Stock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereMfrEsd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereMfrQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereTurn14ProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14Stock whereWarehouseStock($value)
 */
	class Turn14Stock extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_alert
 * @property string $turn14_product_id
 * @property int $ps_product_id
 * @property string $email
 * @property int $watch_local
 * @property int $watch_usa
 * @property int $watch_mfr
 * @property string $token
 * @property string $date_add
 * @property string|null $date_notified
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereDateNotified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereIdAlert($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert wherePsProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereTurn14ProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereWatchLocal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereWatchMfr($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14StockAlert whereWatchUsa($value)
 */
	class Turn14StockAlert extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_vehicle_filter
 * @property int $id_model
 * @property int $id_make
 * @property string $name
 * @property string $make
 * @property string $model
 * @property string $year
 * @property string $image
 * @property bool $active
 * @property string $date_add
 * @property string $date_upd
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereDateAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereDateUpd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereIdMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereIdModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereIdVehicleFilter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14VehicleFilter whereYear($value)
 */
	class Turn14VehicleFilter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id_turn14_weight_range
 * @property float $from
 * @property float $to
 * @property float $price
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange whereFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange whereIdTurn14WeightRange($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Turn14WeightRange whereTo($value)
 */
	class Turn14WeightRange extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Filament\Models\Contracts\FilamentUser {}
}

