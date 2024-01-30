import React from 'react'


interface Props {
    page: number;
    onPageChange: (val: number) => void,
    totalElements: number;
    size: number;
}

export default function Pagination(props: Props) {
    const pages = Math.ceil(props.totalElements / props.size);
    if (pages === 1) {
        return null;
    }
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li onClick={() => {
                    props.onPageChange(Math.min(0, props.page - 1));
                }} className="page-item"><span className="page-link" >Previous</span></li>
                {
                    new Array(pages).fill(0).map((e, index) => {
                        return (
                            <li onClick={() => {
                                props.onPageChange(index);
                            }} className="page-item">
                                <span className={"page-link " + (index === props.page ? 'active' : '')}>
                                    {index + 1}
                                </span>
                            </li>
                        )
                    })
                }
                <li onClick={() => {
                    props.onPageChange(Math.max(pages - 1, props.page + 1));
                }} className="page-item"><span className="page-link" >Next</span></li>
            </ul>
        </nav>
    )
}
