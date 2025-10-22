
function fn(param: { [key: string]: any } & { a: string, b: number }) {


}

// @ts-expect-error
fn({ a: "1" })