import { FieldApi, useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { z } from "zod";
import { RootState, useAppDispatch } from "../store";
import { IMenu } from "../../../types/menu";
import {
  fetchTreeData,
  setSelectedTree,
  setTipe,
} from "../store/slices/treeSlice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  depth: z.number(),
  id: z.string(),
  parentData: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .optional(),
});

interface DropdownItem {
  value: string;
  label: string;
}

const FormComponent = () => {
  const selector = useSelector((state: RootState) => state.tree);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const flattenTree = (items: IMenu[]): DropdownItem[] => {
    return items.reduce((acc: DropdownItem[], item) => {
      acc.push({ value: item.id, label: item.name });
      if (item.children && item.children.length > 0) {
        acc.push(...flattenTree(item.children));
      }
      return acc;
    }, []);
  };

  const dropwDownData = selector.treeData.length
    ? flattenTree(selector.treeData)
    : [{ value: "", label: "No Parent" }];

  const generateSlug = (val: string) => {
    if (val) {
      return val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  };

  const reset = () => {
    form.reset({
      depth: 0,
      name: "",
      parentData: {
        label: "No Parent",
        value: "",
      },
      id: ''
    });
    dispatch(setTipe("add"));
    dispatch(setSelectedTree(null));
    dispatch(fetchTreeData());
  };

  const submitAdd = async (temp: {
    name: string;
    depth: number;
    parentId: string | undefined;
    slug: string;
  }) => {
    setLoading(true);
    const response = await fetch("/api/add-menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...temp,
        ordering: selector.treeData.length + 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add menu");
    }
    setLoading(false);
    reset();
  };

  const submitEdit = async (temp: {
    name: string;
    depth: number;
    parentId: string | undefined;
    slug: string;
  }) => {
    setLoading(true);
    const response = await fetch("/api/update-menu", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...temp, id: selector.selectedTree?.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to edit menu");
    }
    setLoading(false);
    reset();
  };

  const form = useForm({
    defaultValues: {
      name: selector.selectedTree?.name ?? "",
      depth: selector.selectedTree?.depth ?? 0,
      id: selector.selectedTree?.id ?? "",
      parentData: dropwDownData.find(
        (item) => item.value === selector.selectedTree?.parentId
      ),
    },
    onSubmit: async ({ value }) => {
      const temp = {
        name: value.name,
        parentId:
          value?.parentData?.value === ""
            ? undefined
            : value?.parentData?.value,
        slug: generateSlug(value.name),
        depth: value.depth,
      };
      if (selector.tipe === "add") {
        submitAdd(temp);
      } else {
        submitEdit(temp);
      }
    },
    validators: {
      onChange: userSchema,
    },
  });

  console.log("object :", form.state.errors);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col space-y-4"
      >
        <div className="flex flex-col space-y-2 w-50">
          <form.Field name="depth">
            {(field) => (
              <>
                <label className='text-[#475467]' htmlFor={field.name}>Depth</label>
                <input
                  className="rounded-[16px] py-[14px] px-[16px] h-[52px] bg-[#EAECF0] w-[50%]"
                  name={field.name}
                  type="number"
                  disabled
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col space-y-2 w-[50%]">
          <form.Field name="parentData">
            {(field) => (
              <>
                <label className='text-[#475467]' htmlFor={field.name}>Parent Data</label>
                <select
                  className="rounded-[16px] py-[14px] px-[16px] h-[52px] bg-[#F9FAFB]"
                  value={field.state.value?.value}
                  onChange={(e) => {
                    const selectedItem = dropwDownData.find(
                      (item) => item.value === e.target.value
                    );
                    field.handleChange(selectedItem || undefined);
                    const findInTree = (
                      items: IMenu[],
                      targetId: string
                    ): IMenu | undefined => {
                      for (const item of items) {
                        if (item.id === targetId) return item;
                        if (item.children) {
                          const found = findInTree(item.children, targetId);
                          if (found) return found;
                        }
                      }
                      return undefined;
                    };

                    const selectedDepth = selectedItem?.value
                      ? findInTree(selector.treeData, selectedItem.value)
                      : undefined;
                    console.log("selectedDepth :", selectedDepth);
                    form.setFieldValue(
                      "depth",
                      (selectedDepth?.depth || 0) + 1
                    );
                  }}
                >
                  <option value="">No Parent</option>
                  {dropwDownData.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col space-y-2">
          <form.Field name="name">
            {(field) => (
              <>
                <label className='text-[#475467]' htmlFor={field.name}>Name</label>
                <input
                  className="rounded-[16px] py-[14px] px-[16px] h-[52px] bg-[#F9FAFB] w-[50%]"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <div className="text-red-500">
                  <FieldInfo field={field} />
                </div>
              </>
            )}
          </form.Field>
        </div>

        <button
          type="submit"
          className="bg-arctic-blue px-[32px] py-[14px] rounded-full text-white w-[50%] h-[52px]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
