"use client";

import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | any[];
}

export default function JsonViewer({ data }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 overflow-auto text-sm">
      <JsonView data={data} shouldExpandNode={allExpanded} style={darkStyles} />
    </div>
  );
}
