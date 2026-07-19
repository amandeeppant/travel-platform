/**
 * Station Search API
 * GET /api/trains/stations/search?q=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { trainService } from '@/lib/trainService';
import { handleTrainError } from '@/lib/trainErrors';
import { logger } from '@/lib/logger';
import { ApiListResponse } from '@/types/train';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      const response: ApiListResponse<any> = {
        success: true,
        data: [],
        total: 0,
      };
      return NextResponse.json(response);
    }

    await trainService.initialize();
    const stations = await trainService.searchStations(query);

    const response: ApiListResponse<any> = {
      success: true,
      data: stations,
      total: stations.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Station search error', { error });
    const errorInfo = handleTrainError(error);

    const response: ApiListResponse<any> = {
      success: false,
      data: [],
      error: errorInfo,
    };

    return NextResponse.json(response, { status: errorInfo.statusCode || 400 });
  }
}
