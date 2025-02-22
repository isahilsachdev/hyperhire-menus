"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import FormComponent from "./components/form";
import TreeView from "./components/tree-menu";
import { setTreeData } from "./store/slices/treeSlice";

export default function Page() {
  const dispatch = useDispatch();
  const fetchPosts = async () => {
    const res = await fetch("/api/fetch-data");
    const data = await res.json();
    dispatch(setTreeData(data));
  };
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex space-x-4 items-center">
        <div className="rounded-full bg-arctic-blue w-12 h-12 flex justify-center items-center">
          <Image
            src="/submenu-white.svg"
            alt="Menu Logo"
            width={24}
            height={24}
          />
        </div>
        <h1 className="text-blue-gray font-black text-2xl">Menus</h1>
      </div>
      <div className="p-4 w-full">
        <div className="flex mt-4">
          <div className="w-1/2">
            <TreeView />
          </div>
          <div className="w-1/2">
            <FormComponent refetch={fetchPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
