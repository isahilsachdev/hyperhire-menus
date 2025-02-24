"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormComponent from "./components/form";
import TreeView from "./components/tree-menu";
import { setTreeData } from "./store/slices/treeSlice";

export default function Page() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/fetch-data");
    const data = await res.json();
    dispatch(setTreeData(data));
    setLoading(false);
  };
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex space-x-4 items-center p-[16px]">
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
      <div className="p-[16px] w-[90%]">
        <div className="flex flex-col lg:flex-row mt-4 gap-6">
          <div className="w-[90%] lg:w-[50%]">
            <TreeView loading={loading} />
          </div>
          <div className="w-[90%] lg:w-[40%]">
            <FormComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
