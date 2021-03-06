package com.lbyt.client.enums;

public enum OrderStatusEnum {
	// 未接单
	UNORDER(0),
	// 已接单
	ORDERED(1),
	// 配送中
	DELIVERED(2),
	// 配送完成
	COMPLETE(3),
	// 订单取消
	CANCEL(4),
	// 订单关闭
	CLOSED(5),
	// 订单删除
	DELETED(6);
	private int status;
	
	private OrderStatusEnum(int status){
		this.status = status;
	}
	
	public String toString(){
		return String.valueOf(this.status);
	}
	
	public static boolean isOneOfThem(String status){
		return OrderStatusEnum.UNORDER.toString().equals(status) || OrderStatusEnum.ORDERED.toString().equals(status) || OrderStatusEnum.DELIVERED.toString().equals(status) || OrderStatusEnum.COMPLETE.toString().equals(status) || OrderStatusEnum.CANCEL.toString().equals(status) || OrderStatusEnum.CLOSED.toString().equals(status);
	}
	
}
