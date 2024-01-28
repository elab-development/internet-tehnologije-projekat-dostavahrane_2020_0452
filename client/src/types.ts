export interface Item {
    id: number,
    createdAt: string,
    name: string,
    price: number,
    image: string;
    disabled: boolean,
    storeId: number
}
export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'prepared'
export type DriverStatus = 'assigned' | 'picked_up' | 'delivered'
export interface Order {
    id: number,
    createdAt: string,
    address: string,
    status: OrderStatus,
    driverStatus: DriverStatus,
    lat: number,
    lng: number,
    rating?: number,
    client: User,
    driver: User,
    store: Store,
    items: OrderItem[],
    prepTime: number,
    deliveryTime: number,
    deliveryPrice: number
}
export interface Pagination<T> {
    data: T[],
    page: number,
    total: number
}

export interface OrderItem {
    id: number,
    createdAt: string,
    item: Item,
    count: number,
    price: number
}

export interface Store {
    id: number,
    createdAt: string,
    lat: number,
    lng: number,
    address: string,
    name: string,
    items: Item[]
}
export type UserType = 'client' | 'driver' | 'merchant' | 'admin'
export interface User {
    id: number,
    createdAt: string,
    name: string,
    email: string,
    phone: string,
    userType: UserType

}

export interface GeoAddress {
    lat: number,
    lng: number,
    address: string,
}