/**
 * Train Search API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { trainService } from '@/lib/trainService';
import { handleTrainError } from '@/lib/trainErrors';
import { logger } from '@/lib/logger';
import { SearchTrainRequest, ApiResponse, ApiListResponse } from '@/types/train';

/**
 * POST /api/trains/search
 * Search for trains between two stations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SearchTrainRequest;

    await trainService.initialize();
    const results = await trainService.searchTrains(body);

    const response: ApiListResponse<any> = {
      success: true,
      data: results,
      total: results.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Train search error', { error });
    const errorInfo = handleTrainError(error);

    const response: ApiResponse<null> = {
      success: false,
      error: errorInfo,
    };

    return NextResponse.json(response, { status: errorInfo.statusCode || 400 });
  }
}
