<?php
//Merchandising Stock Controller
use App\Http\Controllers\Inventory\MIStockController; 
use App\Http\Controllers\Inventory\ItemGroupController; //Merchandising Item Controller 
use App\Http\Controllers\Inventory\ItemController;  //Merchandising Item Group(s) Controller
use App\Http\Controllers\Inventory\InventorySettingsController;
use App\Http\Controllers\Inventory\CategoryController;

//begin::CategoryController
  Route::post('inventory/category/details', [CategoryController::class, 'getCategoryDetails']);
  Route::post('inventory/category/list', [CategoryController::class, 'getCategories']);
  Route::post('inventory/category/delete', [CategoryController::class, 'deleteCategory']);
  Route::post('inventory/category/save', [CategoryController::class, 'saveCategory']);
//End::CategoryController


//begin::ItemController
  Route::post('inventory/item/photos', [ItemController::class, 'getItemPhotos']);
  Route::post('inventory/item/photo-first', [ItemController::class, 'getFirstItemPhoto']);
  Route::post('inventory/item/save-photo', [ItemController::class, 'saveItemPhoto']);
  Route::post('inventory/item/add-photo', [ItemController::class, 'addItemPhoto']);

  Route::post('inventory/item-info', [ItemController::class, 'getItemInfo']);
  Route::post('inventory/item/info', [ItemController::class, 'getItemInfo']);
  Route::post('inventory/item-details', [ItemController::class, 'getItemDetails']);
  Route::post('inventory/items', [ItemController::class, 'getItemList']);
  Route::post('inventory/items-paginate', [ItemController::class, 'getItemList_paginate']);
  Route::post('inventory/delete-item', [ItemController::class, 'deleteItem']);
  Route::post('inventory/save-item', [ItemController::class, 'saveItem']);
//End::ItemController
 
//begin::ItemGroupController
    Route::post('inventory/group/details', [ItemGroupController::class, 'getItemGroupDetails']);
    Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
    //Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
    Route::post('inventory/group/list', [ItemGroupController::class, 'getItemGroups']);
    Route::post('inventory/group/list-paginate', [ItemGroupController::class, 'getItemGroups_paginate']);
    //Route::post('inventory/group-list', [ItemGroupController::class, 'getItemGroups']);
    Route::post('inventory/group/delete', [ItemGroupController::class, 'deleteItemGroup']);
    Route::post('inventory/group/save', [ItemGroupController::class, 'saveItemGroup']);
    Route::post('inventory/group/rename', [ItemGroupController::class, 'renameGroup']);
    Route::post('inventory/group/form-options', [ItemGroupController::class, 'getFormOptions']);
//End::RMItemGroupController
 
//begin::MIStockController
        //stock/groups  
        Route::post('inventory/stock/group-list', [MIStockController::class, 'getGroupList']);
        Route::post('inventory/stock/group-items', [MIStockController::class, 'getItemsByGroup']);
        Route::post('inventory/stock/classes', [MIStockController::class, 'getStockClasses']); 
        Route::post('inventory/stock/receive-items', [MIStockController::class, 'receiveVPO']);
        Route::post('inventory/stock/receive-vpo', [MIStockController::class, 'receiveVPO']);
        Route::post('inventory/stock/adjust', [MIStockController::class, 'adjustGroupQty']);
        Route::post('inventory/stock/receive-returns', [MIStockController::class, 'receiveReturns']); 
        Route::post('inventory/stock/return-to-vendor', [MIStockController::class, 'returnToVendor']);
 
        Route::post('inventory/stock/transfer', [MIStockController::class, 'transfer']);
        //Transfer stock items Qty from one class to another class
        Route::post('inventory/stock/transfer-class', [MIStockController::class, 'transferClass']); 
        
          //update selling prices, and cost
          Route::post('inventory/item/update-prices', [MIStockController::class, 'updateItemPrices']);
          //update item's sku and do the sku conversion for item avaliable in stock
          Route::post('inventory/item/change-sku', [MIStockController::class, 'updateItemSKU']);
          //Update item's name, code, category
          Route::post('inventory/item/update-info', [MIStockController::class, 'updateItemInfo']);
  //End::MIStockController

  //begin::InventorySettingsController =>  Inventory Settings.
  Route::post('inventory/settings/invoice-form-options',[InventorySettingsController::class, 'invoice_form_options']);
  Route::post('inventory/settings/options-group',[InventorySettingsController::class, 'getComboItems_group']);
  Route::post('inventory/settings/item-form-options',[InventorySettingsController::class, 'getItemFormOptions']);
  Route::post('inventory/settings/stock-tracking-options', [InventorySettingsController::class, 'getStockTrackingFormOptions']);
  Route::post('inventory/settings/vpo-form-options',[InventorySettingsController::class, 'getReceiveVPOOptions']);
  Route::post('inventory/settings/options-detail-type',[InventorySettingsController::class, 'getComboItems_detailtype']);
  Route::post('inventory/settings/options-category',[InventorySettingsController::class, 'getComboItems_category']);
  Route::post('inventory/settings/options-unit',[InventorySettingsController::class, 'getComboItems_unit']);
  Route::post('inventory/settings/options-sku',[InventorySettingsController::class, 'getComboItems_unit']);
  Route::post('inventory/settings/options-manufacturer',[InventorySettingsController::class, 'getComboItems_manufacturer']);
  Route::post('inventory/settings/save-unit', [InventorySettingsController::class, 'saveUnit']);
  Route::post('inventory/settings/save-sku', [InventorySettingsController::class, 'saveUnit']);
  Route::post('inventory/settings/save-manufacturer', [InventorySettingsController::class, 'saveManufacturer']);
  Route::post('inventory/settings/save-brand', [InventorySettingsController::class, 'saveBrand']);
  Route::post('inventory/settings/options-stock-class', [InventorySettingsController::class, 'getComboItems_stockclass']);
  Route::post('inventory/settings/receive-stock-options', [InventorySettingsController::class, 'getReceiveStockFormOptions']);
  Route::post('inventory/settings/options-warehouse', [InventorySettingsController::class, 'getComboItems_warehouse']);
  
  //begin:: Inventory Settings
      Route::post('inventory/settings/unit/delete', [InventorySettingsController::class, 'deleteUnit']);
      Route::post('inventory/settings/unit/list', [InventorySettingsController::class, 'getUnitList']);
      Route::post('inventory/settings/unit/save', [InventorySettingsController::class, 'saveUnit']);
      //Route::post('inventory/settings/delete-sku', [InventorySettingsController::class, 'deleteUnit']);

      Route::post('inventory/settings/manufacturer/delete', [InventorySettingsController::class, 'deleteManufacturer']);
      Route::post('inventory/settings/manufacturer/list', [InventorySettingsController::class, 'getManufacturerList']);
      Route::post('inventory/settings/manufacturer/save', [InventorySettingsController::class, 'saveManufacturer']);

      Route::post('inventory/settings/brand/delete', [InventorySettingsController::class, 'deleteBrand']);
      Route::post('inventory/settings/brand/list', [InventorySettingsController::class, 'getBrandList']);
      Route::post('inventory/settings/brand/save', [InventorySettingsController::class, 'saveBrand']);
 //end:: InventorySettings
