import jsPDF from "jspdf";

abstract class Layout {
  public children: Layout | null;
  public width: number = 0;
  public height: number = 0;
  public nodeWidth: number = 0;
  public nodeHeight: number = 0;

  protected constructor(
    width: number = 0,
    height: number = 0,
    children: Layout | null = null
  ) {
    this.height = height;
    this.width = width;
    this.nodeHeight = height;
    this.nodeWidth = width;
    this.children = children;
  }

  abstract evaluate(doc: jsPDF): void;
  abstract draw(doc: jsPDF, x: number, y: number): [number, number];
}

export default Layout;
