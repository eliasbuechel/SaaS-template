"use client";

import { useProducts } from "@/hooks/useProducts";
import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  ChoiceList,
  TabProps,
  IndexFiltersProps,
  Page,
  Button,
  IndexFiltersMode,
  Spinner,
  InlineStack,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/shopify/Product";

interface IViewSettings {
  searchQuery: string;
  productStatus: string[];
  sortingOptions: string[];
}

function ProductList() {
  const { products, isLoading, reload } = useProducts();
  const DEFAULT_SORTING_SETTING: string[] = ["id asc"];
  const DEFAULT_SEARCH_QUERY_FILTER_SETTINGS: string = "";
  const DEFAULT_PRODUCT_STATUS_FILTER_SETTINGS: string[] = [];

  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Id", value: "id asc", directionLabel: "Ascending" },
    { label: "Id", value: "id desc", directionLabel: "Descending" },
    { label: "Title", value: "title asc", directionLabel: "A-Z" },
    { label: "Title", value: "title desc", directionLabel: "Z-A" },
  ];

  const [viewNames, setViewNames] = useState<string[]>(["All"]);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(0);
  const [viewSettings, setViewSettings] = useState<
    Record<string, IViewSettings>
  >({
    All: {
      searchQuery: DEFAULT_SEARCH_QUERY_FILTER_SETTINGS,
      productStatus: DEFAULT_PRODUCT_STATUS_FILTER_SETTINGS,
      sortingOptions: DEFAULT_SORTING_SETTING,
    },
  });

  const [selectedSortingOptions, setSelectedSortingOptions] = useState<
    string[]
  >(DEFAULT_SORTING_SETTING);
  const [selectedProductStatus, setSelectedProductStatus] = useState<string[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    DEFAULT_SEARCH_QUERY_FILTER_SETTINGS,
  );
  const { mode, setMode } = useSetIndexFiltersMode();

  const createNewViewWithCurrentFilterSettings = useCallback(
    async (viewName: string): Promise<boolean> => {
      setViewNames([...viewNames, viewName]);
      setViewSettings((prev) => ({
        ...prev,
        [viewName]: {
          searchQuery,
          productStatus: selectedProductStatus,
          sortingOptions: selectedSortingOptions,
        },
      }));
      setSelectedViewIndex(viewNames.length);
      return true;
    },
    [viewNames, searchQuery, selectedProductStatus, selectedSortingOptions],
  );

  const duplicateView = useCallback(
    async (newViewName: string): Promise<boolean> => {
      setViewNames([...viewNames, newViewName]);
      setViewSettings((prev) => ({
        ...prev,
        [newViewName]: {
          searchQuery,
          productStatus: selectedProductStatus,
          sortingOptions: selectedSortingOptions,
        },
      }));
      setSelectedViewIndex(viewNames.length);
      return true;
    },
    [viewNames, searchQuery, selectedProductStatus, selectedSortingOptions],
  );

  const renameView = useCallback(
    async (newViewName: string, oldViewIndex: number): Promise<boolean> => {
      const oldViewName = viewNames[oldViewIndex];

      const updatedViewNames = [...viewNames];
      updatedViewNames[oldViewIndex] = newViewName;
      setViewNames(updatedViewNames);

      setViewSettings((prev) => {
        const { [oldViewName]: oldSettings, ...rest } = prev;

        return {
          ...rest,
          [newViewName]: oldSettings,
        };
      });

      return true;
    },
    [viewNames],
  );

  const deleteView = useCallback(
    async (index: number): Promise<boolean> => {
      const viewName = viewNames[index];
      setViewNames((prev) => prev.filter((_, i) => i !== index));
      setViewSettings((prev) => {
        const { [viewName]: deletingSettings, ...rest } = prev;
        return rest;
      });
      setSelectedViewIndex(0);
      return true;
    },
    [viewNames],
  );

  const tabs: TabProps[] = viewNames.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onPrimaryAction: (newViewName: string) =>
                renameView(newViewName, index),
            },
            {
              type: "duplicate",
              onPrimaryAction: duplicateView,
            },
            {
              type: "edit",
              onAction: () => setMode(IndexFiltersMode.Filtering),
            },
            {
              type: "delete",
              onPrimaryAction: () => deleteView(index),
            },
          ],
  }));

  const onHandleCancel = () => {};

  const saveFilterSettingsForView = useCallback(async (): Promise<boolean> => {
    const viewName: string = viewNames[selectedViewIndex];
    setViewSettings((prev) => ({
      ...prev,
      [viewName]: {
        ...prev[viewName],
        productStatus: selectedProductStatus,
        searchQuery,
      },
    }));
    return true;
  }, [viewNames, selectedViewIndex, selectedProductStatus, searchQuery]);

  const primaryAction: IndexFiltersProps["primaryAction"] =
    selectedViewIndex === 0
      ? {
          type: "save-as",
          onAction: createNewViewWithCurrentFilterSettings,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: saveFilterSettingsForView,
          disabled: false,
          loading: false,
        };

  const handleProductStatusFilterChange = useCallback((value: string[]) => {
    setSelectedProductStatus(value);
  }, []);

  const handleSearchQueryChange = useCallback(
    (value: string) => setSearchQuery(value),
    [],
  );
  const handleProductStatusFilterRemove = useCallback(
    () => setSelectedProductStatus(DEFAULT_PRODUCT_STATUS_FILTER_SETTINGS),
    [],
  );

  const handleFiltersClearAll = useCallback(() => {
    setSelectedProductStatus(DEFAULT_PRODUCT_STATUS_FILTER_SETTINGS);
    setSearchQuery(DEFAULT_SEARCH_QUERY_FILTER_SETTINGS);
  }, []);

  const handleSelectedViewIndexChange = useCallback(() => {
    const viewName = viewNames[selectedViewIndex];

    setSelectedSortingOptions(
      viewSettings[viewName]?.sortingOptions ?? DEFAULT_SORTING_SETTING,
    );
    setSearchQuery(
      viewSettings[viewName]?.searchQuery ??
        DEFAULT_SEARCH_QUERY_FILTER_SETTINGS,
    );
    setSelectedProductStatus(
      viewSettings[viewName]?.productStatus ??
        DEFAULT_PRODUCT_STATUS_FILTER_SETTINGS,
    );
  }, [viewNames, selectedViewIndex, viewSettings]);

  const handleSelectedSortingOptionsChange = useCallback(() => {
    const viewName: string = viewNames[selectedViewIndex];

    setViewSettings((prev) => ({
      ...prev,
      [viewName]: {
        ...prev[viewName],
        sortingOptions: selectedSortingOptions,
      },
    }));
  }, [viewNames, selectedViewIndex, selectedSortingOptions]);

  useEffect(handleSelectedViewIndexChange, [selectedViewIndex]);
  useEffect(handleSelectedSortingOptionsChange, [selectedSortingOptions]);

  const filters = [
    {
      key: "productStatus",
      label: "Product status",
      filter: (
        <ChoiceList
          title="Product status"
          titleHidden
          choices={[
            { label: "Draft", value: "draft" },
            { label: "Active", value: "active" },
            { label: "Archived", value: "archived" },
          ]}
          selected={selectedProductStatus || []}
          onChange={handleProductStatusFilterChange}
          allowMultiple
        />
      ),
      pinned: true,
    },
  ];

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (selectedProductStatus && !isEmpty(selectedProductStatus)) {
    const key = "productStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, selectedProductStatus),
      onRemove: handleProductStatusFilterRemove,
    });
  }

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const applySort = (products: Product[]): Product[] => {
    let sortedProducts = [...products];
    selectedSortingOptions.forEach((sort) => {
      sortedProducts = sortedProducts.sort((a, b) => {
        if (sort == "id asc") return a.id - b.id;
        if (sort == "id desc") return b.id - a.id;
        if (sort === "title asc") return a.title.localeCompare(b.title);
        if (sort === "title desc") return b.title.localeCompare(a.title);
        return 0;
      });
    });
    return sortedProducts;
  };

  const applyFilters = (products: Product[]): Product[] => {
    return products.filter((p) => {
      const matchesQuery =
        searchQuery === "" ||
        p.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !selectedProductStatus ||
        selectedProductStatus.length === 0 ||
        selectedProductStatus.includes(p.status);

      return matchesQuery && matchesStatus;
    });
  };

  const filteredProducts: Product[] = applyFilters(products);
  const filteredAndSortedProducts: Product[] = applySort(filteredProducts);

  const mappedProduct = filteredAndSortedProducts.map((product) => ({
    ...product,
    id: product.id.toString(),
  }));

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(mappedProduct);

  const rowMarkup = mappedProduct.map(
    ({ id, title, vendor, product_type, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{id}</IndexTable.Cell>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
        <IndexTable.Cell>{product_type}</IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page
      title="Products"
      primaryAction={
        <Button variant={"primary"} onClick={reload}>
          Reload
        </Button>
      }
    >
      {isLoading ? (
        <InlineStack align="center">
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </InlineStack>
      ) : (
        <Card>
          <IndexFilters
            sortOptions={sortOptions}
            sortSelected={selectedSortingOptions}
            queryValue={searchQuery}
            queryPlaceholder="Searching in all"
            onQueryChange={handleSearchQueryChange}
            onQueryClear={() => setSearchQuery("")}
            onSort={setSelectedSortingOptions}
            primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selectedViewIndex}
            onSelect={setSelectedViewIndex}
            canCreateNewView
            onCreateNewView={createNewViewWithCurrentFilterSettings}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable
            resourceName={resourceName}
            itemCount={mappedProduct.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Id" },
              { title: "Title" },
              { title: "Vendor" },
              { title: "Product Type" },
              { title: "Status" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      )}
    </Page>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return (value as string[]).map((val) => `Customer ${val}`).join(", ");
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | any[]) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

export default ProductList;
